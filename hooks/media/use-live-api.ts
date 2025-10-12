/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GenAILiveClient } from '../../lib/genai-live-client';
import { LiveConnectConfig, Modality, LiveServerToolCall } from '@google/genai';
import { AudioStreamer } from '../../lib/audio-streamer';
import { audioContext } from '../../lib/utils';
import VolMeterWorket from '../../lib/worklets/vol-meter';
import { useLogStore, useSettings } from '@/lib/state';
import * as toolLogic from '../../lib/tools/tool-logic';

export type UseLiveApiResults = {
  client: GenAILiveClient;
  setConfig: (config: LiveConnectConfig) => void;
  config: LiveConnectConfig;

  connect: () => Promise<void>;
  disconnect: () => void;
  connected: boolean;

  volume: number;
};

// --- Sound Effect Logic ---
const soundEffects = [
  '/sounds/sparkle.mp3',
  '/sounds/magic-chime.mp3',
  '/sounds/positive-plink.mp3',
];

function playSoundEffect() {
  const soundToPlay = soundEffects[Math.floor(Math.random() * soundEffects.length)];
  const audio = new Audio(soundToPlay);
  audio.play().catch(e => console.error("Error playing sound effect:", e));
}
// -------------------------

export function useLiveApi({
  apiKey,
}: {
  apiKey: string;
}): UseLiveApiResults {
  const { model } = useSettings();
  const client = useMemo(() => new GenAILiveClient(apiKey, model), [apiKey, model]);
  const isFirstAudioChunkOfTurn = useRef(true);

  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  const [volume, setVolume] = useState(0);
  const [connected, setConnected] = useState(false);
  const [config, setConfig] = useState<LiveConnectConfig>({});

  // register audio for streaming server -> speakers
  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: 'audio-out' }).then((audioCtx: AudioContext) => {
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        audioStreamerRef.current
          .addWorklet<any>('vumeter-out', VolMeterWorket, (ev: any) => {
            setVolume(ev.data.volume);
          })
          .then(() => {
            // Successfully added worklet
          })
          .catch(err => {
            console.error('Error adding worklet:', err);
          });
      });
    }
  }, [audioStreamerRef]);

  useEffect(() => {
    const onOpen = () => {
      setConnected(true);
    };

    const onClose = () => {
      setConnected(false);
    };

    const stopAudioStreamer = () => {
      if (audioStreamerRef.current) {
        audioStreamerRef.current.stop();
      }
    };

    const onAudio = (data: ArrayBuffer) => {
      if (isFirstAudioChunkOfTurn.current) {
        playSoundEffect();
        isFirstAudioChunkOfTurn.current = false;
      }
      if (audioStreamerRef.current) {
        audioStreamerRef.current.addPCM16(new Uint8Array(data));
      }
    };
    
    const onTurnComplete = () => {
        isFirstAudioChunkOfTurn.current = true;
        const last = useLogStore.getState().turns.at(-1);
        if (last && !last.isFinal) {
          useLogStore.getState().updateLastTurn({ isFinal: true });
        }
    };


    // Bind event listeners
    client.on('open', onOpen);
    client.on('close', onClose);
    client.on('interrupted', stopAudioStreamer);
    client.on('audio', onAudio);
    client.on('turncomplete', onTurnComplete);


    const onToolCall = (toolCall: LiveServerToolCall) => {
      const functionResponses: any[] = [];
      const toolFunctions: { [key: string]: Function } = toolLogic;

      for (const fc of toolCall.functionCalls) {
        // Log the function call trigger
        const triggerMessage = `Triggering function call: **${
          fc.name
        }**\n\`\`\`json\n${JSON.stringify(fc.args, null, 2)}\n\`\`\``;
        useLogStore.getState().addTurn({
          role: 'system',
          text: triggerMessage,
          isFinal: true,
        });

        // Execute the actual tool logic
        let result: any = { error: `Function ${fc.name} not found.` };
        if (toolFunctions[fc.name]) {
          try {
            result = toolFunctions[fc.name](fc.args);
          } catch (e: any) {
            result = { error: `Error executing function ${fc.name}: ${e.message}` };
          }
        }

        // Prepare the response with the actual result from the tool
        functionResponses.push({
          id: fc.id,
          name: fc.name,
          response: { result: result },
        });
      }

      // Log the function call response
      if (functionResponses.length > 0) {
        const responseMessage = `Function call response:\n\`\`\`json\n${JSON.stringify(
          functionResponses,
          null,
          2,
        )}\n\`\`\``;
        useLogStore.getState().addTurn({
          role: 'system',
          text: responseMessage,
          isFinal: true,
        });
      }

      client.sendToolResponse({ functionResponses: functionResponses });
    };

    client.on('toolcall', onToolCall);

    return () => {
      // Clean up event listeners
      client.off('open', onOpen);
      client.off('close', onClose);
      client.off('interrupted', stopAudioStreamer);
      client.off('audio', onAudio);
      client.off('toolcall', onToolCall);
      client.off('turncomplete', onTurnComplete);
    };
  }, [client]);

  const connect = useCallback(async () => {
    if (!config) {
      throw new Error('config has not been set');
    }
    if (audioStreamerRef.current) {
      await audioStreamerRef.current.resume();
    }
    client.disconnect();
    isFirstAudioChunkOfTurn.current = true;
    await client.connect(config);
  }, [client, config]);

  const disconnect = useCallback(async () => {
    client.disconnect();
    if (audioStreamerRef.current) {
      audioStreamerRef.current.stop();
    }
    setConnected(false);
  }, [setConnected, client]);

  return {
    client,
    config,
    setConfig,
    connect,
    connected,
    disconnect,
    volume,
  };
}

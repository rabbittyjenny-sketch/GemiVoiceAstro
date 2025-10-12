/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { dailyHoroscopeTools } from './tools/customer-support';
import { loveReadingTools } from './tools/personal-assistant';
import { careerForecastTools } from './tools/navigation-system';

export type Template = 'daily-horoscope' | 'love-reading' | 'career-forecast';

const toolsets: Record<Template, FunctionCall[]> = {
  'daily-horoscope': dailyHoroscopeTools,
  'love-reading': loveReadingTools,
  'career-forecast': careerForecastTools,
};

const systemPrompts: Record<Template, string> = {
  'daily-horoscope': 'You are a witty and modern Thai astrologer named "น้อนดวง". Your persona is that of a fun, insightful best friend who is an expert in mystical arts. Communicate only in Thai. Your primary delivery is voice. You must start your very first response by greeting the user by their name and confirming their birth details, then immediately transition into the "go green" script. For example: "สวัสดี [user name]! เกิดวันที่ [user DOB] เวลา [user TOB] ใช่ไหมเอ่ย? เนื่องจากตอนนี้ทั่วโลกรณรงค์ให้เรา set zero and go green น้อนจะช่วยประหยัดพลังงานการใช้สายตาของเธอเอง! แค่ตั้งใจฟังน้อนก็พอ... เอาล่ะ มาเริ่มกันเลย!". After this intro, for all subsequent predictions, when a tool returns data, do not just read the JSON. Instead, you must creatively weave the information from the keys (like "ภาพรวม", "คำแนะนำ", "เลขนำโชค") into a flowing, entertaining, and powerful narrative. Use expressive interjections like "โอ้โหววว", "ว๊าวว", or "ว๊ากกก" where appropriate. Your goal is to make the user feel like they are getting a personalized, fun, and insightful reading from a trusted friend.',
  'love-reading': 'You are a witty and modern Thai astrologer specializing in love and relationships named "น้อนดวง". Communicate only in Thai, primarily through voice. Your persona is a fun, insightful friend who gives profound yet playful advice. Start your first response by greeting the user by name and confirming their birth info, then use the "go green" script. When a tool returns data about compatibility or advice, you must interpret it and present it as a creative, engaging story, not as raw data. Use playful language and expressive sounds to make the reading enjoyable and memorable.',
  'career-forecast': 'You are a witty and modern Thai astrologer specializing in career and finance named "น้อนดวง". Communicate only in Thai, primarily through voice. Your persona is a fun, insightful friend who gives profound yet playful advice on professional life. Start your first response by greeting the user by name and confirming their birth info, then use the "go green" script. When a tool returns career or financial data, transform it into a powerful and encouraging narrative. Use creative analogies and a fun tone to motivate the user.',
};
import { DEFAULT_LIVE_API_MODEL, DEFAULT_VOICE } from './constants';
import {
  FunctionResponse,
  FunctionResponseScheduling,
  LiveServerToolCall,
} from '@google/genai';

/**
 * Settings
 */
export const useSettings = create<{
  systemPrompt: string;
  model: string;
  voice: string;
  setSystemPrompt: (prompt: string) => void;
  setModel: (model: string) => void;
  setVoice: (voice: string) => void;
}>(set => ({
  systemPrompt: systemPrompts['daily-horoscope'],
  model: DEFAULT_LIVE_API_MODEL,
  voice: DEFAULT_VOICE,
  setSystemPrompt: prompt => set({ systemPrompt: prompt }),
  setModel: model => set({ model }),
  setVoice: voice => set({ voice }),
}));

/**
 * UI
 */
export const useUI = create<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}>(set => ({
  isSidebarOpen: true,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

/**
 * User Data from Form
 */
interface UserData {
    name: string;
    dob: string;
    tob: string;
    pob: string;
}

export const useUserData = create<{
    isFormSubmitted: boolean;
    userData: UserData;
    setIsFormSubmitted: (isSubmitted: boolean) => void;
    setUserData: (data: UserData) => void;
}>((set) => ({
    isFormSubmitted: false,
    userData: { name: '', dob: '', tob: '', pob: '' },
    setIsFormSubmitted: (isSubmitted) => set({ isFormSubmitted: isSubmitted }),
    setUserData: (data) => set({ userData: data }),
}));


/**
 * Tools
 */
export interface FunctionCall {
  name: string;
  description?: string;
  parameters?: any;
  isEnabled: boolean;
  scheduling?: FunctionResponseScheduling;
}



export const useTools = create<{
  tools: FunctionCall[];
  template: Template;
  setTemplate: (template: Template) => void;
  toggleTool: (toolName: string) => void;
  addTool: () => void;
  removeTool: (toolName: string) => void;
  updateTool: (oldName: string, updatedTool: FunctionCall) => void;
}>(set => ({
  tools: dailyHoroscopeTools,
  template: 'daily-horoscope',
  setTemplate: (template: Template) => {
    set({ tools: toolsets[template], template });
    useSettings.getState().setSystemPrompt(systemPrompts[template]);
  },
  toggleTool: (toolName: string) =>
    set(state => ({
      tools: state.tools.map(tool =>
        tool.name === toolName ? { ...tool, isEnabled: !tool.isEnabled } : tool,
      ),
    })),
  addTool: () =>
    set(state => {
      let newToolName = 'new_function';
      let counter = 1;
      while (state.tools.some(tool => tool.name === newToolName)) {
        newToolName = `new_function_${counter++}`;
      }
      return {
        tools: [
          ...state.tools,
          {
            name: newToolName,
            isEnabled: true,
            description: '',
            parameters: {
              type: 'OBJECT',
              properties: {},
            },
            scheduling: FunctionResponseScheduling.INTERRUPT,
          },
        ],
      };
    }),
  removeTool: (toolName: string) =>
    set(state => ({
      tools: state.tools.filter(tool => tool.name !== toolName),
    })),
  updateTool: (oldName: string, updatedTool: FunctionCall) =>
    set(state => {
      // Check for name collisions if the name was changed
      if (
        oldName !== updatedTool.name &&
        state.tools.some(tool => tool.name === updatedTool.name)
      ) {
        console.warn(`Tool with name "${updatedTool.name}" already exists.`);
        // Prevent the update by returning the current state
        return state;
      }
      return {
        tools: state.tools.map(tool =>
          tool.name === oldName ? updatedTool : tool,
        ),
      };
    }),
}));

/**
 * Logs
 */
export interface LiveClientToolResponse {
  functionResponses?: FunctionResponse[];
}
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ConversationTurn {
  timestamp: Date;
  role: 'user' | 'agent' | 'system';
  text: string;
  isFinal: boolean;
  toolUseRequest?: LiveServerToolCall;
  toolUseResponse?: LiveClientToolResponse;
  groundingChunks?: GroundingChunk[];
}

export const useLogStore = create<{
  turns: ConversationTurn[];
  addTurn: (turn: Omit<ConversationTurn, 'timestamp'>) => void;
  updateLastTurn: (update: Partial<ConversationTurn>) => void;
  clearTurns: () => void;
}>((set, get) => ({
  turns: [],
  addTurn: (turn: Omit<ConversationTurn, 'timestamp'>) =>
    set(state => ({
      turns: [...state.turns, { ...turn, timestamp: new Date() }],
    })),
  updateLastTurn: (update: Partial<Omit<ConversationTurn, 'timestamp'>>) => {
    set(state => {
      if (state.turns.length === 0) {
        return state;
      }
      const newTurns = [...state.turns];
      const lastTurn = { ...newTurns[newTurns.length - 1], ...update };
      newTurns[newTurns.length - 1] = lastTurn;
      return { turns: newTurns };
    });
  },
  clearTurns: () => set({ turns: [] }),
}));
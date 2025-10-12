/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionResponseScheduling } from '@google/genai';
import { FunctionCall } from '../state';

export const dailyHoroscopeTools: FunctionCall[] = [
  {
    name: 'get_daily_horoscope',
    description: 'ให้คำทำนายดวงชะตาประจำวันตามราศีเกิดของผู้ใช้',
    parameters: {
      type: 'OBJECT',
      properties: {
        zodiac_sign: {
          type: 'STRING',
          description: 'ราศีเกิดของผู้ใช้ เช่น Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces',
        },
      },
      required: ['zodiac_sign'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'get_lucky_number_and_color',
    description: 'บอกเลขนำโชคและสีมงคลประจำวันสำหรับราศีที่กำหนด',
    parameters: {
      type: 'OBJECT',
      properties: {
        zodiac_sign: {
          type: 'STRING',
          description: 'ราศีเกิดของผู้ใช้',
        },
      },
      required: ['zodiac_sign'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
];

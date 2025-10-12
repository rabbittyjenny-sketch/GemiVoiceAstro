/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionCall } from '../state';
import { FunctionResponseScheduling } from '@google/genai';

export const careerForecastTools: FunctionCall[] = [
  {
    name: 'get_career_prediction',
    description: 'ให้คำทำนายด้านการงานและการเงินสำหรับราศีที่กำหนด',
    parameters: {
      type: 'OBJECT',
      properties: {
        zodiac_sign: {
          type: 'STRING',
          description: 'ราศีของผู้ใช้',
        },
      },
      required: ['zodiac_sign'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'get_best_career_matches',
    description: 'แนะนำอาชีพที่เหมาะสมกับดวงชะตาตามราศีเกิด',
    parameters: {
      type: 'OBJECT',
      properties: {
        zodiac_sign: {
          type: 'STRING',
          description: 'ราศีของผู้ใช้',
        },
      },
      required: ['zodiac_sign'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
];

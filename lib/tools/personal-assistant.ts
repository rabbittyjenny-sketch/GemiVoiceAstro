/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { FunctionCall } from '../state';
import { FunctionResponseScheduling } from '@google/genai';

export const loveReadingTools: FunctionCall[] = [
  {
    name: 'check_love_compatibility',
    description: 'ตรวจสอบความเข้ากันได้ในเรื่องความรักระหว่างสองราศี',
    parameters: {
      type: 'OBJECT',
      properties: {
        zodiac_sign_1: {
          type: 'STRING',
          description: 'ราศีของบุคคลที่หนึ่ง',
        },
        zodiac_sign_2: {
          type: 'STRING',
          description: 'ราศีของบุคคลที่สอง',
        },
      },
      required: ['zodiac_sign_1', 'zodiac_sign_2'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
  {
    name: 'get_love_advice',
    description: 'ให้คำแนะนำด้านความรักตามราศีและสถานะความสัมพันธ์',
    parameters: {
      type: 'OBJECT',
      properties: {
        zodiac_sign: {
          type: 'STRING',
          description: 'ราศีของผู้ใช้',
        },
        relationship_status: {
          type: 'STRING',
          description: 'สถานะความสัมพันธ์ปัจจุบัน (เช่น โสด, มีแฟน, ความสัมพันธ์ซับซ้อน)',
        },
      },
      required: ['zodiac_sign', 'relationship_status'],
    },
    isEnabled: true,
    scheduling: FunctionResponseScheduling.INTERRUPT,
  },
];

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { astrologyData } from '../astrology-data';

// Helper function to find a zodiac sign by its Thai or English name (case-insensitive)
const findSignData = (signName: string) => {
  if (!signName) return null;
  const lowerCaseSignName = signName.toLowerCase().trim();
  const signKey = Object.keys(astrologyData).find(key => {
    const sign = astrologyData[key];
    return key.toLowerCase() === lowerCaseSignName || sign.th_sign_name.includes(lowerCaseSignName);
  });
  return signKey ? astrologyData[signKey] : null;
};

// --- Tool Implementations ---

export function get_daily_horoscope({ zodiac_sign }: { zodiac_sign: string }) {
  const signData = findSignData(zodiac_sign);
  if (!signData) {
    return { error: `ไม่พบข้อมูลสำหรับราศี "${zodiac_sign}"` };
  }
  return {
    ราศี: signData.th_sign_name,
    ภาพรวมวันนี้: signData.description_summary,
    ลักษณะนิสัย: signData.traits,
    คำแนะนำพิเศษ: signData.advice,
  };
}

export function get_lucky_number_and_color({ zodiac_sign }: { zodiac_sign: string }) {
  const signData = findSignData(zodiac_sign);
  if (!signData) {
    return { error: `ไม่พบข้อมูลสำหรับราศี "${zodiac_sign}"` };
  }
  return {
    ราศี: signData.th_sign_name,
    เลขนำโชค: signData.lucky_sign.lucky_number,
    สีมงคล: signData.lucky_sign.color,
    อัญมณีเสริมดวง: signData.lucky_sign.gem,
    เครื่องราง: signData.lucky_charm,
  };
}

export function check_love_compatibility({ zodiac_sign_1, zodiac_sign_2 }: { zodiac_sign_1: string; zodiac_sign_2: string }) {
  const sign1Data = findSignData(zodiac_sign_1);
  const sign2Data = findSignData(zodiac_sign_2);

  if (!sign1Data || !sign2Data) {
    return { error: 'กรุณาระบุราศีให้ถูกต้องทั้งสองราศี' };
  }

  // Simple compatibility logic based on elements
  const compatibilityMap: { [key: string]: string[] } = {
    Fire: ['Fire', 'Air'],
    Earth: ['Earth', 'Water'],
    Air: ['Air', 'Fire'],
    Water: ['Water', 'Earth'],
  };

  const areCompatible = compatibilityMap[sign1Data.element_name].includes(sign2Data.element_name);
  
  let resultText = `ความสัมพันธ์ระหว่าง ${sign1Data.th_sign_name} (ธาตุ${sign1Data.element_name}) และ ${sign2Data.th_sign_name} (ธาตุ${sign2Data.element_name}) `;

  if (areCompatible) {
    resultText += "ถือว่าเข้ากันได้ดีมาก! ธาตุของพวกคุณส่งเสริมกัน ทำให้มีความเข้าใจและดึงดูดกันเป็นพิเศษ";
  } else {
    resultText += "อาจจะต้องปรับตัวเข้าหากันพอสมควร เนื่องจากธาตุของพวกคุณแตกต่างกัน แต่อย่าเพิ่งท้อ! ความแตกต่างก็สร้างสีสันให้ความรักได้เหมือนกัน";
  }

  return {
    คู่ราศี: `${sign1Data.th_sign_name} และ ${sign2Data.th_sign_name}`,
    ความเข้ากันได้: resultText,
    ลักษณะของราศีที่หนึ่ง: sign1Data.traits,
    ลักษณะของราศีที่สอง: sign2Data.traits,
  };
}

export function get_love_advice({ zodiac_sign, relationship_status }: { zodiac_sign: string; relationship_status: string }) {
  const signData = findSignData(zodiac_sign);
  if (!signData) {
    return { error: `ไม่พบข้อมูลสำหรับราศี "${zodiac_sign}"` };
  }
  
  let advice = '';
  if (relationship_status.includes('โสด')) {
    advice = `สำหรับชาว ${signData.th_sign_name} ที่ยังโสด ด้วยนิสัยที่เป็นคน ${signData.traits} ช่วงนี้ลองเปิดใจให้กว้าง อาจจะเจอคนที่ใช่ในที่ที่ไม่คาดคิด!`;
  } else if (relationship_status.includes('มีแฟน') || relationship_status.includes('มีคู่')) {
    advice = `สำหรับชาว ${signData.th_sign_name} ที่มีคู่แล้ว การสื่อสารคือหัวใจสำคัญ ลองใช้ความเป็น ${signData.traits} ของคุณในการเติมความหวานให้แก่กันและกัน`;
  } else {
     advice = `สำหรับชาว ${signData.th_sign_name} ที่สถานะไม่ชัดเจน การกลับมาทบทวนความรู้สึกของตัวเองเป็นสิ่งสำคัญที่สุด แล้วคุณจะพบคำตอบ`;
  }

  return {
    ราศี: signData.th_sign_name,
    สถานะ: relationship_status,
    คำแนะนำความรัก: advice,
  };
}

export function get_career_prediction({ zodiac_sign }: { zodiac_sign: string }) {
    const signData = findSignData(zodiac_sign);
    if (!signData) {
      return { error: `ไม่พบข้อมูลสำหรับราศี "${zodiac_sign}"` };
    }
    return {
      ราศี: signData.th_sign_name,
      ภาพรวมการงาน: `ด้วยลักษณะที่เป็นคน ${signData.traits} ทำให้ชาว ${signData.th_sign_name} มีแนวโน้มที่จะประสบความสำเร็จในงานที่ต้องใช้ ${signData.keywords}`,
      คำแนะนำด้านการเงิน: signData.advice, // Re-using general advice which often includes financial tips
    };
}

export function get_best_career_matches({ zodiac_sign }: { zodiac_sign: string }) {
    const signData = findSignData(zodiac_sign);
    if (!signData) {
      return { error: `ไม่พบข้อมูลสำหรับราศี "${zodiac_sign}"` };
    }
    // Simple career suggestions based on keywords
    let suggestions = 'ข้อมูลทั่วไป'
    if (signData.keywords.includes('Action') || signData.keywords.includes('Expression')) {
        suggestions = 'งานที่ต้องใช้ความคิดสร้างสรรค์, งานในวงการบันเทิง, หรือการเป็นผู้นำโปรเจกต์';
    } else if (signData.keywords.includes('Analysis') || signData.keywords.includes('Structure')) {
        suggestions = 'งานที่ต้องการความละเอียดรอบคอบ เช่น นักวิเคราะห์, โปรแกรมเมอร์, หรือนักบัญชี';
    } else if (signData.keywords.includes('Harmony') || signData.keywords.includes('Nurturing')) {
        suggestions = 'งานที่เกี่ยวกับการดูแลช่วยเหลือผู้อื่น เช่น แพทย์, พยาบาล, ครู, หรือนักสังคมสงเคราะห์';
    }

    return {
        ราศี: signData.th_sign_name,
        อาชีพที่เหมาะสม: suggestions,
        จุดแข็ง: signData.traits,
    };
}

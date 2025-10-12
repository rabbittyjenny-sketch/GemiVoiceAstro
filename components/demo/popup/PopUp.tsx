/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import './PopUp.css';

interface PopUpProps {
  onClose: () => void;
}

const PopUp: React.FC<PopUpProps> = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>ยินดีต้อนรับสู่ AI โหราศาสตร์ by Gemini</h2>
        <p>สัมผัสประสบการณ์ใหม่ในการดูดวง ที่คุณไม่ต้องอ่าน แต่ใช้การฟัง! AI ของเราจะพูดคุยกับคุณเหมือนเพื่อนสนิทที่รู้ใจ</p>
        <p>วิธีเริ่มต้น:</p>
        <ol>
          <li><span className="icon">play_circle</span>กดปุ่ม Play เพื่อเริ่มพูดคุยกับ AI</li>
          <li><span className="icon">record_voice_over</span>ถามคำถามเกี่ยวกับดวงของคุณ เช่น "ดวงวันนี้เป็นยังไง?"</li>
          <li><span className="icon">psychology</span>ตั้งใจฟังคำทำนายสุดพิเศษ แล้วมาดูกันว่าดวงดาวจะบอกอะไรกับคุณ!</li>
        </ol>
        <button onClick={onClose}>เริ่มเลย!</button>
      </div>
    </div>
  );
};

export default PopUp;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import './WelcomeScreen.css';
import { useUserData } from '../../../lib/state';

const WelcomeScreen: React.FC = () => {
  const { setUserData, setIsFormSubmitted } = useUserData();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && dob && tob && pob) {
      setUserData({ name, dob, tob, pob });
      setIsFormSubmitted(true);
    } else {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    }
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="title-container">
          <span className="welcome-icon">auto_awesome</span>
          <h1>น้อนดวง เพื่อนซี้สายมู</h1>
        </div>
        <p>กรอกข้อมูลของคุณเพื่อรับคำทำนายสุดพิเศษเฉพาะตัวคุณ!</p>
        <form className="horoscope-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">ชื่อของคุณ</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น สมหญิง" required />
            </div>
            <div className="form-field">
              <label htmlFor="dob">วัน/เดือน/ปีเกิด</label>
              <input type="date" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="tob">เวลาเกิด</label>
              <input type="time" id="tob" value={tob} onChange={(e) => setTob(e.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="pob">สถานที่เกิด (จังหวัด)</label>
              <input type="text" id="pob" value={pob} onChange={(e) => setPob(e.target.value)} placeholder="เช่น กรุงเทพมหานคร" required />
            </div>
          </div>
          <button type="submit" className="submit-button">ดูคำทำนาย</button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;
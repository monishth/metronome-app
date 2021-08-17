import React from 'react';
import './Header.css';
const Header = () => {
  return (
    <header>
      <div className="header">
        <div>
          <h1>Online Metronome</h1>
          <p>Choose a bpm between 30 and 210 or use the tap button for tempo</p>
        </div>
      </div>
    </header>
  );
};

export default Header;

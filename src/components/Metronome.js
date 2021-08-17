import React from 'react';
import metronome_click from '../assets/single_metronome_sound.flac';
import play_button from '../assets/download.png';
import { useState, useEffect } from 'react';
const Metronome = () => {
  //Normal JS Audio object
  const audio = new Audio(metronome_click);
  const [intervalID, setIntervalID] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [metronomeSettings, setMetronomeSettings] = useState({
    bpm: 100,
    period: 60000 / 100,
  });

  //triggered by start on stop button when needed
  const togglePlaying = () => {
    setPlaying((playing) => !playing);
    console.log(playing);
    if (playing) {
      setIntervalID(setInterval(() => audio.play(), metronomeSettings.period));
      //audio.play();
      console.log('playing', playing, intervalID);
    } else {
      console.log('clearing', playing, intervalID);
      clearInterval(intervalID);
    }
  };

  //function to test increasing bpm while the interval is already going
  const incrementBPM = (addbpm) => {
    setMetronomeSettings({
      bpm: metronomeSettings.bpm + addbpm,
      period: 60000 / (metronomeSettings.bpm + addbpm),
    });
    clearInterval(intervalID);
    setIntervalID(setInterval(() => audio.play(), metronomeSettings.period));
  };

  return (
    <div>
      <img src={play_button} alt="loool" onClick={togglePlaying} />
      <button type="button" onClick={() => incrementBPM(10)}>
        add some uno
      </button>
    </div>
  );
};

export default Metronome;

import React from 'react';
import metronome_click from '../assets/single_metronome_sound.flac';
import play_button from '../assets/download.png';
import { useState } from 'react';
const Metronome = () => {
  //Normal JS Audio object
  const audio = new Audio(metronome_click);
  const [intervalID, setIntervalID] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [metronomeSettings, setMetronomeSettings] = useState({
    bpm: 100,
    period: 60000 / 100,
  });

  //triggered by start on stop button when needed
  const togglePlaying = () => {
    console.log(isPlaying);
    let newIsPlaying = !isPlaying;
    if (newIsPlaying) {
      if (intervalID) {
        clearInterval(intervalID);
      }
      setIntervalID(setInterval(() => audio.play(), metronomeSettings.period));
      audio.play();
      console.log('playing', newIsPlaying, intervalID);
    } else {
      console.log('clearing', newIsPlaying, intervalID);
      clearInterval(intervalID);
      setIntervalID(null);
    }

    setIsPlaying((playing) => !playing);
  };

  //function to test increasing bpm while the interval is already going

  const setBPM = (newBPM) => {
    if (newBPM >= 35 && newBPM < 210) {
      setMetronomeSettings({
        bpm: newBPM,
        period: 60000 / newBPM,
      });
      if (isPlaying) {
        clearInterval(intervalID);
        setIntervalID(
          setInterval(() => audio.play(), metronomeSettings.period)
        );
        audio.play();
      }
    }
  };

  return (
    <div>
      <img src={play_button} alt="play button" onClick={togglePlaying} />
      <div>
        <button
          type="button"
          onClick={() => setBPM(metronomeSettings.bpm - 10)}
        >
          Decrease BPM
        </button>
        {metronomeSettings.bpm}
        <button
          type="button"
          onClick={() => setBPM(metronomeSettings.bpm + 10)}
        >
          Increase BPM
        </button>
      </div>
    </div>
  );
};

export default Metronome;

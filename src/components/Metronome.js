import React from 'react';
import metronome_click from '../assets/single_metronome_sound.flac';
import play_button from '../assets/download.png';
import { useState, useRef } from 'react';
const Metronome = () => {
  //Normal JS Audio object
  const audio = new Audio(metronome_click);

  //useRef hook used so the variable is not lost everytime the component is re-rendered
  let intervalID = useRef(null);
  let tapMeasures = useRef([]);

  // State variables for when a re-render is required (values displayed in UI)
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setMetronomeSettings] = useState(100);
  // const [tapMeasures, setTapMeasures] = useState([]);

  //triggered by start on stop button when needed
  const togglePlaying = () => {
    console.log(isPlaying);
    let newIsPlaying = !isPlaying;
    if (newIsPlaying) {
      if (intervalID.current) {
        clearInterval(intervalID.current);
      }
      intervalID.current = setInterval(() => audio.play(), 60000 / bpm);
      audio.play();
      console.log('playing', newIsPlaying, intervalID.current);
    } else {
      console.log('clearing', newIsPlaying, intervalID.current);
      clearInterval(intervalID.current);
      intervalID.current = null;
    }

    setIsPlaying((playing) => !playing);
  };

  //function to test increasing bpm while the interval is already going

  const setBPM = (newBPM) => {
    if (newBPM >= 35 && newBPM < 210) {
      setMetronomeSettings(newBPM);
      if (isPlaying) {
        clearInterval(intervalID.current);
        intervalID.current = setInterval(() => audio.play(), 60000 / newBPM);
      }
    }
  };

  const tap = () => {
    tapMeasures.current = [...tapMeasures.current, new Date().getTime()];
    if (tapMeasures.current.length > 2) {
      let averageTimeToTap =
        (tapMeasures.current[2] -
          tapMeasures.current[1] +
          (tapMeasures.current[1] - tapMeasures.current[0])) /
        2;
      let newBPM = Math.round(60000 / averageTimeToTap);
      console.log(newBPM);
      setBPM(newBPM);
      tapMeasures.current.shift();
    }
    console.log(tapMeasures.current);
  };

  return (
    <div>
      <img src={play_button} alt="play button" onClick={togglePlaying} />
      <div>
        <button type="button" onClick={() => setBPM(bpm - 10)}>
          Decrease BPM
        </button>
        {bpm}
        <button type="button" onClick={() => setBPM(bpm + 10)}>
          Increase BPM
        </button>
      </div>
      <div>
        <button type="button" onClick={() => tap()}>
          Tap
        </button>
      </div>
    </div>
  );
};

export default Metronome;

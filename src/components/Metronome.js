import React from 'react';
import metronome_click from '../assets/single_metronome_sound.flac';
import play_button from '../assets/download.png';
import { useState, useRef } from 'react';
const Metronome = () => {
  //Normal JS Audio object
  const audio = new Audio(metronome_click);

  //useRef hook used so the variable is not lost everytime the component is re-rendered
  let metronomeID = useRef(null);
  let tapMeasures = useRef([]);

  // State variables for when a re-render is required (values displayed in UI)
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBPM] = useState(100);
  // const [tapMeasures, setTapMeasures] = useState([]);

  // Handles the starting/stopping of the current metronome
  const togglePlaying = () => {
    console.log(isPlaying);
    setIsPlaying((playing) => !playing);
    // The updated state isn't within the scope of this closure until the re-render
    // so a local variable is used
    let newIsPlaying = !isPlaying;
    if (newIsPlaying) {
      // If the metronome needs to be started. also checks to make sure one isnt running
      if (metronomeID.current) {
        clearInterval(metronomeID.current);
      }
      metronomeID.current = createMetronome(bpm);
      audio.play(); // So that the metronome starts on button press instead of after the initial interval
      console.log('playing', newIsPlaying, metronomeID.current);
    } else {
      console.log('clearing', newIsPlaying, metronomeID.current);
      clearInterval(metronomeID.current);
      metronomeID.current = null;
    }
  };

  // Executes setInterval to start metronome
  const createMetronome = (bpm) => {
    return setInterval(() => audio.play(), 60000 / bpm);
  };

  // Updates bpm state variable and creates new metronome (setInterval) if the metronome
  // is currently playing
  const updateBPM = (newBPM) => {
    // Only executes if the bpm is within regular values
    setBPM(newBPM);
    if (isPlaying && newBPM >= 30 && newBPM <= 210) {
      clearInterval(metronomeID.current);
      metronomeID.current = createMetronome(newBPM);
    }
  };

  // Stores the current time in milliseconds every tap, in order to compare times and get a value for bpm
  // Clears old values so only 3 values are held
  const tap = () => {
    tapMeasures.current = [...tapMeasures.current, new Date().getTime()];
    //Begins comparing measures when at least 3 values are stored before clearing
    if (tapMeasures.current.length > 2) {
      let averageTimeToTap =
        (tapMeasures.current[2] -
          tapMeasures.current[1] +
          (tapMeasures.current[1] - tapMeasures.current[0])) /
        2;
      let newBPM = Math.round(60000 / averageTimeToTap); //Rounding needed as calculation results in decimal
      updateBPM(newBPM);
      tapMeasures.current.shift(); // Removes oldest timestamp
    }
  };

  // When the text area loses focues, ensure the bpm is within bounds so that the displayed bpm is always
  // Cant do this onChange as it may take multiple key strokes to type a number and the value inbetween
  // could be erroneous
  const constrainBPM = (e) => {
    if (bpm > 210) {
      updateBPM(210);
    } else if (bpm < 30) {
      updateBPM(30);
    }
  };

  return (
    <div>
      <img src={play_button} alt="play button" onClick={togglePlaying} />
      <div>
        <button type="button" onClick={() => updateBPM(bpm - 10)}>
          Decrease BPM
        </button>
        <input
          type="text"
          value={bpm}
          onChange={(e) => updateBPM(e.target.value)}
          onBlur={(e) => constrainBPM(e)}
        />
        <button type="button" onClick={() => updateBPM(bpm + 10)}>
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

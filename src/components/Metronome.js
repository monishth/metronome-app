import React from 'react';
import metronome_click from '../assets/single_metronome_sound.flac';
import play_button from '../assets/play.png';
import pause_button from '../assets/pause.png';
import { useState, useRef } from 'react';
import './Metronome.css';
const Metronome = () => {
  //Normal JS Audio object
  const audio = new Audio(metronome_click);

  //useRef hook used so the variable is not lost everytime the component is re-rendered
  let metronomeID = useRef(null);
  let tapMeasures = useRef([]);

  // State variables for when a re-render is required (values displayed in UI)
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBPM] = useState(100);
  const [metronomeFlash, setMetronomeFlash] = useState(false);

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
    return setInterval(() => playMetronomeClick(), 60000 / bpm);
  };

  const playMetronomeClick = () => {
    setMetronomeFlash(true);
    setTimeout(() => setMetronomeFlash(false), 200);
    audio.play();
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
      if (averageTimeToTap >= 2000) {
        //If the user has taken a break between taps reset the measures
        tapMeasures.current = [];
      } else {
        let newBPM = Math.round(60000 / averageTimeToTap); //Rounding needed as calculation results in decimal
        constrainBPM(newBPM);
        tapMeasures.current.shift();
      } // Removes oldest timestamp
    }
  };

  // When the text area loses focues, ensure the bpm is within bounds so that the displayed bpm is always
  // Cant do this onChange as it may take multiple key strokes to type a number and the value inbetween
  // could be erroneous
  const constrainBPM = (newBPM) => {
    if (newBPM > 210) {
      updateBPM(210);
    } else if (newBPM < 30) {
      updateBPM(30);
    } else {
      updateBPM(newBPM);
    }
  };

  return (
    <div className="metronome">
      <img
        className={
          metronomeFlash
            ? 'metronome-play-button metronome-play-button-flash'
            : 'metronome-play-button'
        }
        src={isPlaying ? pause_button : play_button}
        alt="play button"
        onClick={togglePlaying}
      />
      <div className="metronome-bpm-controls-container">
        <button
          className="metronome-bpm-controls metronome-button"
          type="button"
          onClick={() => constrainBPM(bpm - 10)}
          style={{ backgroundColor: '#f44336' }}
        >
          Decrease BPM
        </button>
        <label
          style={{ marginRight: 0 }}
          className="metronome-bpm-controls"
          value="BPM"
        >
          BPM:
        </label>
        <input
          className="metronome-bpm-controls"
          type="number"
          value={bpm}
          onChange={(e) => updateBPM(e.target.value)}
          onBlur={(e) => constrainBPM(e.target.value)}
        />
        <button
          className="metronome-bpm-controls metronome-button"
          type="button"
          onClick={() => constrainBPM(bpm + 10)}
          style={{ backgroundColor: '#4CAF50' }}
        >
          Increase BPM
        </button>
      </div>
      <div>
        <button
          className="metronome-button"
          type="button"
          onClick={() => tap()}
          style={{ backgroundColor: '#D2D2D2' }}
        >
          Tap Tempo
        </button>
      </div>
    </div>
  );
};

export default Metronome;

import React, { useState, useEffect } from 'react';
import './App.css';
import alarmSound from './alarm.m4a';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);

  useEffect(() => {
    setTimeLeft(sessionLength * 60);
  }, [sessionLength]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsSession(true);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    const beep = document.getElementById("beep");
    beep.pause();
    beep.currentTime = 0;
  };

  const decrementBreakLength = () => {
    setBreakLength(prev => (prev > 1 ? prev - 1 : prev));
  };

  const incrementBreakLength = () => {
    setBreakLength(prev => (prev < 60 ? prev + 1 : prev));
  };

  const decrementSessionLength = () => {
    setSessionLength(prev => (prev > 1 ? prev - 1 : prev));
  };

  const incrementSessionLength = () => {
    setSessionLength(prev => (prev < 60 ? prev + 1 : prev));
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 0) {
            setIsSession(!isSession);
            setTimeLeft((isSession ? breakLength : sessionLength) * 60);
            const beep = document.getElementById("beep");
            beep.play();
          } else if (prev < 10) {
            const beep = document.getElementById("beep");
            if (!beep.playing) beep.play();
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, isSession, breakLength, sessionLength]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="App">
      <div className="container">
        <div className="controls">
          <div>
            <div id="break-label">Break Length</div>
            <button id="break-decrement" onClick={decrementBreakLength}>-</button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" onClick={incrementBreakLength}>+</button>
          </div>
          <div>
            <div id="session-label">Session Length</div>
            <button id="session-decrement" onClick={decrementSessionLength}>-</button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" onClick={incrementSessionLength}>+</button>
          </div>
        </div>
        <div className="timer">
          <div id="timer-label">{isSession ? "Session" : "Break"}</div>
          <div id="time-left">{formatTime(timeLeft)}</div>
          <button id="start_stop" onClick={handleStartStop}>{isRunning ? "Pause" : "Start"}</button>
          <button id="reset" onClick={handleReset}>Reset</button>
        </div>
      </div>
      <audio id="beep" src={alarmSound}></audio>
    </div>
  );
}

export default App;

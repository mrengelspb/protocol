import React, { useState, useEffect } from 'react';
import '../styles/clock.css';

export default function Clock() {
  const _now = new Date();
  let _Hours = _now.getHours();
  let _Minutes = _now.getMinutes();

  if (_Hours < 10) _Hours = `0${_Hours}`;
  if (_Minutes < 10) _Minutes = `0${_Minutes}`;
  const [date, setDate] = useState(`${_Hours}:${_Minutes}`);

  const refreshClock = () => {
    const now = new Date();
    let Hours = now.getHours();
    let Minutes = now.getMinutes();

    if (Hours < 10) Hours = `0${Hours}`;
    if (Minutes < 10) Minutes = `0${Minutes}`;
    setDate(`${Hours}:${Minutes}`);
  };

  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanUp() {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="clock">
      { date }
    </div>
  );
}

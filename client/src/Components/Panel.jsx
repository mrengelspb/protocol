import React, { useEffect, useState } from 'react';
import '../styles/panel.css';

export default function Panel() {
  const [list, setList] = useState([]);

  const handlerSpaces = async () => {
    try {
      const url = `http://localhost:3000/ticket/spaces`;
      const response = await fetch(url);
      if (response.ok && response.status === 200) {
        const data = await response.json();
        setList(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handlerSpaces();
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  });

  const listHTML = list.map((value) => {
    return (
      <div
        className={`panel--spaces _${value.status}`}
        key={value.id}
      >
        {value.number}
      </div>
    );
  });

  return(
    <div className="panel">
      <div className="panel--container">
        {listHTML}
      </div>
    </div>
  )
};
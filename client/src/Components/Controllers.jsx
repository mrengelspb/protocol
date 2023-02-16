import React from "react";
import '../styles/controllers.css';

export default function Controllers() {
  const handlerCommand = async (command) => {
    try {
      const url = `http://localhost:3000/ticket/command`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: { command },
      });
      if (response.ok && response.status === 200) {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlerClick = (ev) => {
    const svgHTML = ev.target.children[0];
    const a_cl = new Array(...svgHTML.classList);
    if (a_cl.includes('on')) {
      handlerCommand('$OB1'); //implement
      svgHTML.classList.remove('on');
      svgHTML.classList.add('off');
    } else {
      handlerCommand('$OB2'); //implement
      svgHTML.classList.remove('off');
      svgHTML.classList.add('on');
    }
  };

  return (
    <div className="controller--container">
      <div className="card--info">
          <ul className="card--info--list">
            <li className="card--info--list--item">
              <p>Base de Datos</p>
              <div className="square">
                {true === true
                  ? <div className="on" />
                  : <div className="off" /> }
              </div>
            </li>
            <li className="card--info--list--item">
              <p>Internet</p>
              <div className="square">
                {window.navigator.onLine
                  ? <div className="on" />
                  : <div className="off" /> }
              </div>
            </li>
            <li className="card--info--list--item">
              <p>Controlador</p>
              <div className="square">
                {window.navigator.onLine
                  ? <div className="on" />
                  : <div className="off" /> }
              </div>
            </li>
          </ul>
        </div>

        <div className="controllers--buttons">
        <div className="loader-circle-93">
            <svg
              onClick={handlerClick}
              viewBox="0 0 100 100">
                <circle
                  className="on"
                  cx="50"
                  cy="50"
                  r="30"
                  strokeWidth="8"
                  fill="none"
                />
            </svg>
        </div>
        <div className="loader-circle-93">
            <svg
              onClick={handlerClick}
              viewBox="0 0 100 100">
                <circle
                  className="on"
                  cx="50"
                  cy="50"
                  r="30"
                  strokeWidth="8"
                  fill="none"
                />
            </svg>
        </div>
        </div>
    </div>
  )
}

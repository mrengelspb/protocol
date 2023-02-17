import React, { useState, useEffect } from "react";
import '../styles/controllers.css';

export default function Controllers() {
  const [controller, setController] = useState([]);
  const handlerController = async () => {
    try {
      const url = `http://localhost:3000/ticket/controller`;
      const response = await fetch(url);
      if (response.ok && response.status === 200) {
        const data = await response.json();
        setController(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlerCommand = async (nTerminal, command) => {
    try {
      const url = `http://localhost:3000/ticket/command`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          command,
          nTerminal: nTerminal,
          status: 0,
          id_parking: 14,
        }),
      });
      console.log(response);
      if (response.ok && response.status === 200) {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlerClick = (ev) => {
    let svgHTML;
    let buttonHTML;
    if (ev.target.tagName === 'circle') {
      svgHTML = ev.target;
      buttonHTML = ev.target.parentNode.parentNode;
    } else if (ev.target.tagName === 'svg')  {
      svgHTML = ev.target.children[0];
      buttonHTML = ev.target.parentNode;
    } else {
      svgHTML = ev.target.children[0].children[0];
      buttonHTML = ev.target;
    }

    if (!buttonHTML.disabled) {
      buttonHTML.disabled = true;
      handlerCommand(buttonHTML.id, `$OB${buttonHTML.id}`); //implement
      svgHTML.classList.add('off');
    }
    setTimeout(()=> {
      svgHTML.classList.remove('off');
      buttonHTML.disabled = false;
    }, 1000);
  };

  useEffect(() => {
    handlerController();
  }, []);

  const controllerHTML = controller.map((ctlr) => {
    return (
      <button id={ctlr.nTerminal} className="loader-circle-93" onClick={handlerClick} key={ctlr.id}>
        <svg
          viewBox="0 0 60 60">
            <circle
              cx="30"
              cy="30"
              r="26"
              strokeWidth="6"
              fill="white"
              />
        </svg>
      </button>
    )
  })



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
        {controllerHTML}
      </div>
    </div>
  )
}

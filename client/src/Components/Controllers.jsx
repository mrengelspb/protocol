import React from "react";
import '../styles/controllers.css';

export default function Controllers() {
  const handlerClick = (ev) => {
    const buttonHTML = ev.target;
    buttonHTML.classList.add('roll');
    // buttonHTML.classList.toggle('roll');
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
        </div>6

        <div className="controllers--buttons">
        <div class="loader-circle-93">
            <svg viewbox="0 0 100 100">
                <circle cx="50" cy="50" r="30" stroke-width="8" fill="none"/>
            </svg>
            <button onClick={handlerClick}> fdasd </button>
        </div>
        <div class="loader-circle-93-r">
            <svg viewbox="0 0 100 100">
                <circle cx="50" cy="50" r="30" stroke-width="8" fill="none"/>
            </svg>
            <button onClick={handlerClick}> fasdf </button>
        </div>
          <div>
            {/* <button onClick={handlerClick}>  </button> */}
          </div>
          <div>
            <button onClick={handlerClick}>  </button>
          </div>
        </div>
    </div>
  )
}

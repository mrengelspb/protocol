import React from "react";
import '../styles/controllers.css';

export default function Controllers() {
  const handlerClick = (ev) => {
    console.dir(ev.target);
    const svgHTML = ev.target.children[0];
    const a_cl = new Array(...svgHTML.classList)
    console.log(a_cl)
    if (a_cl.includes('on')) {
      svgHTML.classList.remove('on');
      svgHTML.classList.add('off');
    } else {
      svgHTML.classList.remove('off');
      svgHTML.classList.add('on');
    }
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
        </div>

        <div className="controllers--buttons">
        <div className="loader-circle-93">
            <svg
              onClick={handlerClick}
              viewbox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  stroke-width="8"
                  fill="none"
                />
            </svg>
        </div>
        <div className="loader-circle-93">
            <svg
              onClick={handlerClick}
              viewbox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  stroke-width="8"
                  fill="none"
                />
            </svg>
        </div>
        </div>
    </div>
  )
}

import React from 'react';
import '../styles/searchTicketForm.css';

export default function SearchTicketForm() {
  return (
    <form className="card--form">
      <label htmlFor="in" />
      <input
        className="card--form--input input"
        placeholder="Ingreso"
        type="text"
        id="in"
        readOnly
      />
      <label htmlFor="out" />
      <input
        className="card--form--input input"
        placeholder="Salida"
        type="text"
        id="out"
        readOnly
      />
      <span className="card--form--ouput  input" id="time">{'Tiempo'}</span>
      <span className="card--form--ouput" id="total">{'Total'}</span>
      <div>
        <button
          className="card--button--jump button"
          tabIndex="9"
          type="button"
        >
          Exonerar
        </button>
        <button
          className="card--button--pay button"
          id="card--button--pay"
          tabIndex="10"
          type="button"
        >
          Finalizar
        </button>
      </div>
    </form>
  );
}

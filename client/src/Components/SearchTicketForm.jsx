import React from 'react';
import '../styles/searchTicketForm.css';

export default function SearchTicketForm({ id, ticket }) {
  let In = '';
  let Out = '';
  let Time = '';
  let Total = '';

  const timeFormat = (time) => {
    let hours;
    let days;
    let minutes;

    days = Math.floor(time / (60 * 24));
    hours = Math.floor(((time /(60 * 24)) - days) * 24);
    minutes = Math.floor(((((time /(60 * 24)) - days) * 24) - hours) * 60);

    if (days < 10) {
      days = '0' + days;
    }

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    return `${days} dias ${hours} horas ${minutes} minutos`;
  };

  if (ticket) {
    In = ticket.in;
    Out = ticket.out;
    Time = timeFormat(ticket.time);
    Total = ticket.total;
  }

  const handlerUpdateTicket = async (ev) => {
    ev.preventDefault();
    if (ticket !== null) {
      const url = `http://localhost:3000/ticket/update`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id,
          out: Out,
          total: Total,
          state: 2,
          min_used: ticket.time,
        }),
      });
      console.log(response);
      if (response.ok && response.status === 200) {
        const data = await response.json();
        console.log(data)
      } else {
        console.log("Error");
      }
    }
  };

  return (
    <form className="card--form" onSubmit={handlerUpdateTicket}>
      <label htmlFor="in" />
      <input
        className="card--form--input input"
        placeholder="Ingreso"
        type="text"
        id="in"
        value={In}
        readOnly
      />
      <label htmlFor="out" />
      <input
        className="card--form--input input"
        placeholder="Salida"
        type="text"
        id="out"
        value={Out}
        readOnly
      />
      <span className="card--form--ouput  input" id="time">{Time || 'Tiempo'}</span>
      <span className="card--form--ouput" id="total">{Total || 'Total'}</span>
      <div>
        <button
          className="card--button--pay button"
          id="card--button--pay"
          tabIndex="10"
          type="submit"
        >
          Finalizar
        </button>
      </div>
    </form>
  );
}

import React, { useState } from 'react';
import SearchTicket from './SearchTicket';
import Clock from './Clock';
import SearchTicketForm from './SearchTicketForm';
import Controllers from './Controllers';
import '../styles/ticket.css';

export default function Ticket() {
  const [ticket, setTicket] = useState(null);
  const [id, setId] = useState(null);
  return (
    <div className="ticket">
      <h1 className="ticket--title">Tickets</h1>
      <div className="ticket--info">
        <SearchTicket
          id={id}
          setId={setId}
          setTicket={setTicket}
        />
        <div className="ticket--clock">
          <Clock />
        </div>
      </div>
      <div className="ticket--data">
        <SearchTicketForm
          id={id}
          ticket={ticket}
        />
        <Controllers />
      </div>
    </div>
  );
}

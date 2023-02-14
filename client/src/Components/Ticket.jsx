import React from 'react';
import SearchTicket from './SearchTicket';
import Clock from './Clock';
import SearchTicketForm from './SearchTicketForm';
import Controllers from './Controllers';
import '../styles/ticket.css';

export default function Ticket() {
  return (
    <div className="ticket">
      <h1 className="ticket--title">Tickets</h1>
      <div className="ticket--info">
        <SearchTicket />
        <div className="ticket--clock">
          <Clock />
        </div>
      </div>
      <div className="ticket--data">
        <SearchTicketForm />
        <Controllers />
      </div>
    </div>
  );
}

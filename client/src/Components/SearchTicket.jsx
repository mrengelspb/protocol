import React from 'react';
import { Search, Trash } from 'react-bootstrap-icons';
import '../styles/searchTicket.css';

export default function SearchTicket() {
  return (
    <div className="searchTicket--container">
      <form method="post">
        <label htmlFor="ticket">
          <input
            className="searchTicket--searchBar"
            type="number"
            tabIndex="3"
            id="searchTicket--input"
          />
          <button className="searchTicket--searchButton" tabIndex="4" type="submit">
            <Search color="white" size="15" />
          </button>
          <button
            className="searchTicket--clearButton"
            tabIndex="5"
            type="button"
          >
            <Trash color="white" size="15" />
          </button>
        </label>
      </form>
    </div>
  );
}

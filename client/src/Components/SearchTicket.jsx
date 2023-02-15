import React from 'react';
import { Search, Trash } from 'react-bootstrap-icons';
import '../styles/searchTicket.css';

export default function SearchTicket({ id, setId, setTicket }) {
  const handlerId = (ev) => {
    setId(ev.target.value);
  };

  const handlerSearchTicket = async (ev) => {
    ev.preventDefault();
    try {
      const url = `http://localhost:3000/ticket/search/${id}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID_parking: 4,
        }),
      });
      console.log(response);
      if (response.ok && response.status === 200) {
        const data = await response.json();
        if (data.state !== '2') {
          setTicket(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="searchTicket--container">
      <form method="post" onSubmit={handlerSearchTicket}>
        <label htmlFor="ticket">
          <input
            className="searchTicket--searchBar"
            type="number"
            tabIndex="3"
            id="searchTicket--input"
            onChange={handlerId}
          />
          <button
            className="searchTicket--searchButton"
            tabIndex="4"
            type="submit"
          >
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

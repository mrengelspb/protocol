import React from 'react';
import '../styles/header.css';

export default function Header() {
  return (
    <header className="header">
      <img className="header--logo" src="./assets/logo.svg" alt="Your SVG" />
      <div className="header--local">Parqueadero</div>
      <div className="menu--operador">
      </div>
    </header>
  );
}

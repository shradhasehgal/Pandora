import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class CustomerNavbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">Shopping App</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/search" className="nav-link">Search</Link>
          </li>
          <li className="navbar-item">
          <Link to="/orders" className="nav-link">View orders</Link>
          </li>
          <li className="navbar-item">
          <Link to="/" className="nav-link" onClick={() => {localStorage.clear(); window.location.reload();}}>Logout</Link>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class VendorNavbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">Shopping App</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/add-product" className="nav-link">Add listing</Link>
          </li>
          <li className="navbar-item">
          <Link to="/listings" className="nav-link">View listings</Link>
          </li>
          <li className="navbar-item">
          <Link to="/dispatch" className="nav-link">Dispatch</Link>
          </li>
          <li className="navbar-item">
          <Link to="/reviews" className="nav-link">Reviews</Link>
          </li>
          <li className="navbar-item">
          <Link className="nav-link" to="/" onClick={() => {
            localStorage.clear();
            window.location.href = "/"; }}>Logout</Link>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}
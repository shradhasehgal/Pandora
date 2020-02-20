import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class CustomerNavbar extends Component {

  render() {
    return (
      <div>
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand"> Pandora </Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/search" className="nav-link">Search</Link>
          </li>
          <li className="navbar-item">
          <Link to="/orders" className="nav-link">View orders</Link>
          </li>
          <li className="navbar-item">
          <Link to="/product-review" className="nav-link">Review order</Link>
          </li>
          <li className="navbar-item">
          <Link to="/vendor-review" className="nav-link">Rate Vendor</Link>
          </li>
          <li className="navbar-item">
          <Link className="nav-link" to="/" onClick={() => {
            localStorage.clear();
            window.location.href = "/"; }}>Logout</Link>
          </li>
        </ul>
        </div>
      </nav>
     </div>
    );
  }
}
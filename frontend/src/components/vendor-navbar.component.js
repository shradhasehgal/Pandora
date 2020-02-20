import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class VendorNavbar extends Component {

  render() {
    let vendor_id = localStorage.getItem('user_id');
    let vendor_name = localStorage.getItem('user_name');

    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">Pandora</Link>
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
          <Link to={{ pathname: '/vendor', state: { id: vendor_id, name: vendor_name} }} className="nav-link">Reviews</Link>
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
import React, { Component } from 'react';

export default class Front extends Component {

  render() {
    const mystyle = {
      padding: "10px",
      backgroundColor: "pink",
      fontFamily: "Lato",
      justifyContent: "center",
      color: "white",
      alignItems: "center"
    };

    const oof = {
      padding: "10px",
      fontFamily: "Lato",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      backgroundColor: "purple",

    };
    return (
      <div>
          <h1 style={mystyle}>Welcome to Pandora!</h1>
          <h4 style={oof}>Where all your shopping needs are met.</h4>
        </div>
    );
  }
}
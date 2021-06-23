import React, { Component } from "react";
import logo from "./react.svg";
import { Link, NavLink } from "react-router-dom";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  render() {
    var that = this;
    return (
      <header className={"header block"}>
        <a href={"/"}>
          <h1>חנות לדוגמא</h1>
        </a>
        <ul>
          <li>צור קשר</li>
          <li>מי אנחנו</li>
          <li>מבצעים</li>
          <li>מוצרים חדשים</li>
          <li>
            <a href={"/"}>ראשי</a>
          </li>
        </ul>
      </header>
    );
  }
}

export default Header;

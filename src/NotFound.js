import React, { Component } from "react";
import logo from "./react.svg";
import { Link, NavLink } from "react-router-dom";

class NotFound extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  render() {
    return (
      <div className={"header block"}>
        <h1>404 - דף זה לא נמצא</h1>
        <p>
          <a href={"/"}>חזרה לדף הבית</a>
        </p>
      </div>
    );
  }
}

export default NotFound;

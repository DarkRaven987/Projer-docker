import React from "react";
import "./styles/App.scss";
import AppRouter from "./router/app-router";
import { connect } from "react-redux";

import { getLocalItem } from "./utils/utils";
import { saveTokenAction } from './store/actions/login'

interface DefaultProps {
  saveTokenAction: Function;
}


class App extends React.Component<DefaultProps> {
  componentDidMount() {
    const token = getLocalItem("accessToken");
    if (!token && (window.location.pathname !== "/login" && window.location.pathname !== "/forgot")) {
      window.location.href = "/login";
    } else if (token && (window.location.pathname === "/login" || window.location.pathname === "/forgot")) {
      window.location.href = "/";
    }
  }

  render() {
    return (
      <div className="App">
        <AppRouter />
      </div>
    );
  }
}

const mapDispatchToProps = {
  saveTokenAction
}

export default connect(null, mapDispatchToProps)(App);

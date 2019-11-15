import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";
import Login from "./hcc/Login";
import Layout from "./hcc/Layout";

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{ height: "100%" }}>
          <Route path="/" component={Login} exact />
          <Route path="/login" component={Login} />
          <Route path="/main" component={Layout} />
        </div>
      </Router>
    );
  }
}

export default App;

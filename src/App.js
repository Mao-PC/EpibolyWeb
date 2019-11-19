import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import 'babel-polyfill'
import "./App.css";
import Login from "./hcc/Login";
import Layout from "./hcc/Layout";
import MILayout from "./medical-institution/Layout";

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{ height: "100%" }}>
          <Route path="/" component={Login} exact />
          <Route path="/login" component={Login} />
          <Route path="/hcc" component={Layout} />
          <Route path="/medical-institution" component={MILayout} />
        </div>
      </Router>
    );
  }
}

export default App;

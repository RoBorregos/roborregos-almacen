import React, { Component } from 'react';
import Login from "./components/Login/Login.js";
import Profile from "./components/Profile/Profile.js";
import Warehouse from "./components/Warehouse/Warehouse.js";
import SelectionCart from "./components/SelectionCart/SelectionCart.js";
import NavBar from "./components/NavBar/NavBar.js";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routesData from 'data/routes.json';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleState = this.handleState.bind(this);
    this.resolveApp = this.resolveApp.bind(this);
    this.resolveCookies = this.resolveCookies.bind(this);

    this.state = {
      login: false,
      userName: "",
      userID: "",
      userMail: ""
    }
  }

  handleState(loginStatus, userName, userMail, userID) {

    if (loginStatus == true) this.setState({ login: true, userName: userName, userMail: userMail, userID: userID });
    else this.setState({ login: false, userName: "", userMail: "", userID: "" });
  }

  resolveCookies() {
    if (this.state.login != true) {
      let cookieArr = document.cookie.split(",");
      let key = cookieArr[0].substring(0, cookieArr[0].indexOf('='));

      if (key === "username") {
        this.handleState(
          true,
          cookieArr[0].substring(cookieArr[0].indexOf('=') + 1),
          cookieArr[1].substring(cookieArr[1].indexOf('=') + 1),
          cookieArr[2].substring(cookieArr[2].indexOf('=') + 1)
        );
        return;
      }
    }
  }

  resolveApp() {
    window.onbeforeunload = () => { window.scrollTo(0, 0); }
    if (this.state.login === true) {
      return (
        <Router>
          <div className="app-container">

            <NavBar routes={routesData.routes} />

            <Route
              exact path='/'
              component={() => <Warehouse />}
            />
            <Route
              exact path='/profile'
              component={() => <Profile />}
            />
            <Route
              exact path='/selectionCart'
              component={() => <SelectionCart />}
            />
          </div>
        </Router>
      );
    }
    else {
      return (
        <Login callBackFromParent={this.handleState} />
      );
    }
  }

  render() {
    document.title = "RoBorregos - Almacen";
    this.resolveCookies()
    return (
      this.resolveApp()
    );
  }
}
export default App;

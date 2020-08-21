import './App.css';

import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import Footer from 'components/Footer/Footer.js';
import Login from "./components/Login/Login.js";
import NavBar from "./components/NavBar/NavBar.js";
import Profile from "./components/Profile/Profile.js";
import SelectionCart from "./components/SelectionCart/SelectionCart.js";
import Warehouse from "./components/Warehouse/Warehouse.js";
import cookie from 'react-cookies';
import mock_reservations from './data/mock_reservations.json';
import routesData from 'data/routes.json';
import { logoutAPI } from './scripts/apiScripts.js';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    
    this.state = {
      userId: '',
      userToken: ''
    };
    
  }

  onLogin(userId,userToken) {
    cookie.save('userId', userId, { path: '/' });
    cookie.save('userToken', userToken, { path: '/' });
    this.setState({ userId:userId, userToken:userToken });
  }
  
  async onLogout() {
    await logoutAPI(this.state.userId);
    cookie.remove('userId', { path: '/' });
    cookie.remove('userToken', { path: '/' });
    this.setState({userId:'', userToken:''});
  }
  
  render() {
    document.title = "RoBorregos - Almacen";
    
    window.onbeforeunload = () => { window.scrollTo(0, 0); }
    
    if (this.state.userId !== cookie.load('userId') && typeof cookie.load('userId') !== 'undefined' ) {
      this.setState({ userId:cookie.load('userId') });
    }
    
    if (!this.state.userId)
      return <Login onLogin={ this.onLogin } />;

    return (
      <Router>
        <div className="app-container">

          <NavBar userId={ this.state.userId } onLogout={ this.onLogout } routes={ routesData.routes } />

          <Route
            exact path='/'
            component={ () => <Warehouse /> }
          />
          <Route
            exact path='/profile'
            component={ () => <Profile mock_reservations= { mock_reservations.reservations } memberID= { this.state.userId } /> }
          />
          <Route
            exact path='/selectionCart'
            component={ () => <SelectionCart /> }
          />
          <Footer />
        </div>
      </Router>
    );
    
  }
}
export default App;

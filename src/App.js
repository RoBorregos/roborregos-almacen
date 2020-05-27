import React, { Component } from 'react';
import Login from "./components/Login/Login.js";
import Profile from "./components/Profile/Profile.js";
import Warehouse from "./components/Warehouse/Warehouse.js";
import SelectionCart from "./components/SelectionCart/SelectionCart.js";
import NavBar from "./components/NavBar/NavBar.js";
import Footer from 'components/Footer/Footer.js';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import cookie from 'react-cookies'
import routesData from 'data/routes.json';
import mock_reservations from './data/mock_reservations.json';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    
    this.state = {
      userID: ""
    };
    
  }

  onLogin(userId) {
    this.setState({ userId:userId })
    cookie.save('userId', userId, { path: '/' })
  }
  
  onLogout() {
    this.setState({userID:""});
    cookie.remove('userId', { path: '/' })
  }
  
  render() {
    document.title = "RoBorregos - Almacen";
    
    window.onbeforeunload = () => { window.scrollTo(0, 0); }
    
    if(this.state.userID !== cookie.load('userId')){
      this.setState({ userID:cookie.load('userId') });
    }
    if (!this.state.userID)
      return <Login onLogin={ this.onLogin } />;

    return (
      <Router>
        <div className="app-container">

          <NavBar userID={ this.state.userID } onLogout={ this.onLogout } routes={ routesData.routes } />

          <Route
            exact path='/'
            component={ () => <Warehouse /> }
          />
          <Route
            exact path='/profile'
            component={ () => <Profile mock_reservations= { mock_reservations.reservations }/> }
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

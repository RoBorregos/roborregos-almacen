import React, { Component } from 'react';
import Login from "./components/Login/Login.js";
import Profile from "./components/Profile/Profile.js";
import Warehouse from "./components/Warehouse/Warehouse.js";
import NavBar from "./components/NavBar/NavBar.js";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routesData from 'data/routes.json';
import './App.css';

class App extends Component {
  render() {
    document.title= "RoBorregos - Almacen";

    return (
      <Router>
        <div className= "app-container">
        
          <NavBar routes= { routesData.routes } />

          <Route
            exact path= '/'
            component= { () => <Warehouse /> }
          />
          <Route
            exact path= '/profile'
            component= { () => <Profile /> }
          />
        </div>
      </Router>
    );
  }
}
export default App;

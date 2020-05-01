import React, { Component } from 'react';
import Login from "./components/Login/Login.js";
import Warehouse from "./components/Warehouse/Warehouse.js";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

class App extends Component {
  render() {
    document.title= "RoBorregos - Almacen";

    return (
      <Router>
        <div className= "app-container">

          <Route
            path= '/'
            component={ () => <Warehouse/> }
          />
          <Route
            exact path= '/warehouse'
            component={ () => <Login /> }
          />
        </div>
      </Router>
    );
  }
}
export default App;

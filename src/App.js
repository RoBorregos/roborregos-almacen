import React, { Component } from 'react';
import Login from "./components/Login/Login.js";
import Warehouse from "./components/Warehouse/Warehouse.js";
import { BroweserRouter as Router, Route} from 'react-router-dom';
import membersData from 'data/members.json';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    document.title = "RoBorregos - Almacen";
  
    return (
      <Router>
        <div className= "app-containet">

          <Route
            exact path='/'
            component={ () => <Login membersData = { membersData }/> }
          />

          <Route
            path='/warehouse'
            component={ () => <Warehouse/> }
          />
        </div>
      </Router>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Modal, ModalFooter, ModalBody, Button} from 'react-bootstrap';
import SelectionCart from '../SelectionCart/SelectionCart.js'
import ModalHeader from 'react-bootstrap/ModalHeader';
import logo from 'images/white_logo.png';
import shopCart from 'images/shopping-cart.png'
import './NavBar.css';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.handleNavbarClick = this.handleNavbarClick.bind(this);

    this.routes = props.routes;

    const complete_path = window.location.pathname;
    const first_slash_index = complete_path.indexOf('/');
    const second_slash_index = complete_path.indexOf('/', first_slash_index + 1);
    const current_path = second_slash_index === -1
      ? complete_path.substring(0, complete_path.length)
      : complete_path.substring(0, second_slash_index);
    this.state = {
      active_button: current_path
      ,show: false
    }

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleShow() {
    this.setState({ show: true })
  }

  handleClose() {
    this.setState({ show: false })
  }

  handleNavbarClick(index) {
    this.setState(state => ({
      active_button: index
    }));
  }

  getClassName(path) {
    return 'navbar-btn' + ((path === this.state.active_button) ? ' active' : '');
  }

  render() {
    return (
      <Navbar
        collapseOnSelect
        expand='lg'
        bg='dark'
        variant='dark'
        fixed='top'
        id='app-navbar'
      >
        <Navbar.Brand
          as={ Link }
          to='/'
          onClick={ this.handleNavbarClick.bind(this, '/') }
        >
          <img
            id='navbar-logo'
            src={ logo }
            className='d-inline-block align-top'
            alt='logo'
          />

        </Navbar.Brand>

        <Navbar.Toggle aria-controls='responsive-navbar-nav' expanded ='false'/>
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='mr-auto'>

            {this.routes.map((route, index) =>
              <Nav.Link
                key={ index }
                className={ this.getClassName(route.path) }
                as={ Link }
                to={ route.path }
                onClick={ this.handleNavbarClick.bind(this, '/') }
              >
                <div className='navbar-btn-legend'>
                  { route.legend }
                </div>
              </Nav.Link>
            )}

          </Nav>
        
        </Navbar.Collapse>

        <Nav.Link>
          <div onClick={ this.handleShow }>
            <img
            id = 'navbar-cart'
            src = { shopCart }
            alt = 'shopCart'
            />
            <div onClick={ e => e.stopPropagation() }>
              <Modal
              show = { this.state.show } 
              onHide = { this.handleClose}
            >
              <ModalHeader className = 'cart-head' closeButton><h3>Checkout selection</h3></ModalHeader>
              <ModalBody>
                <SelectionCart
                SelectionCart = {this.SelectionCart}
                />
              </ModalBody>
            </Modal>
            </div>
          </div>
        </Nav.Link>

      </Navbar>

    );
  }

}

export default NavBar;

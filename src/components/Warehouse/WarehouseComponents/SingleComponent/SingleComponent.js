import './SingleComponent.css';

import { Col, Modal, ModalBody } from 'react-bootstrap';
import React, { Component } from 'react';

import ModalHeader from 'react-bootstrap/ModalHeader';
import SingleComponentModal from './SingleComponentModal/SingleComponentModal.js';
import placeholder from 'images/placeholder-rectangle.png';

class SingleComponent extends Component{
  constructor(props) {
    super(props);

    this.tryRequire = this.tryRequire.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.componentKey = props.key;
    this.id = props.id;
    this.component = props.component;
    this.section = props.section;
    
    this.state = {
      show: false
    }
  }

  tryRequire(img_path) {
    try {
        return img_path;
    } catch (err) {
        return placeholder;
    }
  }

  componentDidMount() {
    this.componentKey = this.props.componentKey;
    this.component = this.props.component;
    this.section = this.props.section;
  }

  handleShow() {
    this.setState({ show: true })
  }

  handleClose() {
    this.setState({ show: false })
  }

  render() {
    this.componentDidMount(); 
    return(
      <div className = "singlecomponent_container" onClick = { this.handleShow }>
        <div onClick={ e => e.stopPropagation() }>
          <Modal 
            className = "single_component_modal" 
            show = { this.state.show } 
            onHide = { this.handleClose }
          >
            <ModalHeader className='cart-head' closeButton>
                  <Col xs={ 8 } className='offset-2'>
                    <h2>{ this.component.name }</h2>
                  </Col>
                </ModalHeader>
            <ModalBody>
              <SingleComponentModal 
                componentKey={ this.componentKey }
                handleClose = { this.handleClose }
                component = { this.component }
                section = { this.section }
              />
            </ModalBody>
          </Modal>
        </div>
        <div className = "single_component_back">
          <img
              className = "single_component_image"
              src={ this.tryRequire(this.component.img_path) }
              alt={ this.component.id }
          />
          <p className = "single_component_name">
          { this.component.name }
          </p>
        </div>
      </div>
    );
  }
}
export default SingleComponent;
import './ReturningModal.css';

import { Button, Col, Row } from 'react-bootstrap';
import { Modal, ModalBody } from 'react-bootstrap';
import React, { Component } from 'react';

import ActiveComponents from '../../../data/active_components.json';
import Checkbox from '@material-ui/core/Checkbox';
import ModalHeader from 'react-bootstrap/ModalHeader';
import { connect } from 'react-redux';

class ReturningModal extends Component { 
    constructor(props) { 
        super(props);
        /** @type { string } */
        this.memberID = props.memberID;

        /** @type { number } */
        this.user_index = ActiveComponents.reservations.findIndex( reservation => reservation.memberID === this.memberID );

        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        this.user_components = (
            this.user_index === -1? 
            null : 
            ActiveComponents.reservations[this.user_index].activeComponents
        );

        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.handleIcrement = this.handleIcrement.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.loadReserved = this.loadReserved.bind(this);
        this.checkOneActive = this.checkOneActive.bind(this);
        
        this.state = { 
            /** @type { boolean } */
            disabledButton: true,
            /** @type { boolean } */
            show: false,
            /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
            components: this.user_components,
            /** @type {!Array<{ boolean }>, ...}>}*/
            isActive: new Array(this.user_components != null? this.user_components.length : 0)
        }
    }

    checkOneActive() {
        return this.state.isActive.some(elem => elem === true);
    }

    /* 
    When user clicks on the checkbox the components is confirmed that is going to be returned when clicks return components
    button inside the modal
    */
   /** @param {index: number}*/
    handleCheckBox( index ) {
        const copyOfChecked = this.state.isActive;
        copyOfChecked[index] = !copyOfChecked[index];
        this.setState({isActive: copyOfChecked, disabledButton: !this.checkOneActive()});
    }

    /* 
    Index of the component that is going to modify its quantity (state)
    It's necessary to check that we have not excced our components max reserved quantity 
    */
    /** @param {index: number}*/
    handleIcrement( index ) { 
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const localStorageComponents = JSON.parse(localStorage.getItem('components'));
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const temporaryComponents = this.state.components;

        if(temporaryComponents[index].quantity < localStorageComponents[index].quantity)
            temporaryComponents[index].quantity++;

        this.setState({ components: temporaryComponents });
    }

    /* 
    Index is the index of the component that is going to modify its quantity (state) 
    */
    handleDecrement( index ) { 
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const currentComponents = this.state.components;

        if (currentComponents[index].quantity > 0)
            currentComponents[index].quantity--;
            
        this.setState({ components: currentComponents });
    }

    /* 
    Set the state of the modal and stores user active components 
    */
    handleShow() { 
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const components = this.user_index === -1? null : ActiveComponents.reservations[this.user_index].activeComponents;

        localStorage.setItem('components', JSON.stringify(components));
        this.setState({ show: true })
    }

    /* 
    In case of closing the modal, set state to hidden and store components as they were initially 
    */
    handleClose() { 
        if(this.user_index !== -1){
            /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
            const localStorageComponents = JSON.parse(localStorage.getItem('components'));
            ActiveComponents.reservations[this.user_index].activeComponents = localStorageComponents;
            this.setState({ components: localStorageComponents, show: false })
        } 
        else {
            this.setState({show: false});
        }
    }

    /*
    Loads all components in an array of rows, each row is a component
    */
    loadReserved() {
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const componentsList = [];

        for (let componentIndex = 0; componentIndex < this.state.components.length; componentIndex++) { 
            componentsList.push(
                <Row className='sin_comp_backg_r container bottom-buffer' key={componentIndex}>
                        <Col xs='6' className='container pad-left5'>
                            <Col className='container'>
                                { this.state.components[componentIndex].componentID }
                            </Col>
                        </Col>
                        <Col xs='6' className='container'>
                            <Col xs='2' className='col-pd hor-center align-items-center container'>
                                <Button className='subt-button' 
                                onClick={ () => this.handleDecrement(componentIndex) }
                                >
                                -
                                </Button>
                            </Col>
                            <Col xs='4' className='item-counter col-pd ver-center hor-center container'>
                                <div className="input-group-field">
                                    { this.state.components[componentIndex].quantity }
                                </div>
                            </Col>
                            <Col xs='2' className='col-pd hor-center align-items-center container'>
                                <Button className='add-button' 
                                onClick={ () => this.handleIcrement(componentIndex) }
                                >
                                +
                                </Button>
                            </Col>
                            <Col xs='4' className='col-pd hor-center align-items-center container'>
                                <Checkbox className='checkbox' onClick= { () => this.handleCheckBox(componentIndex) }/>
                            </Col>
                        </Col>
                </Row>
            );
        }
        return componentsList;
    }

    /* 
    In case that our user has no components or has not ever made a reservation, 
    we have to throw a message, other case show reserved components table 
    */
    checkComponents() {
        if(this.user_index === -1 || this.user_components.length === 0){
            return (
                <div>
                    <h3> You have not active reserved components currently </h3>
                </div>
            )
        }
        else {
            return (
                <div>
                    <Row className="headers justify-content-center container bottom-buffer">
                            <Col xs='6' className="align-left container pad-left5">
                                <h5>Component</h5>
                            </Col>
                            <Col xs='6' className="align-left container pad-left5">
                                <h5>Quantity</h5>
                            </Col>
                    </Row>
                    { this.loadReserved() }
                </div>
            )
        } 
    }

    render() {
        return(
            <div onClick={ e => e.stopPropagation() }>
                <Row className='button-row'>
                    <Button onClick={ () => this.handleShow() }> 
                        Click here to return components 
                    </Button>
                </Row>
                <Modal
                show={ this.state.show }
                onHide={ this.handleClose }
                >
                    <ModalHeader className='returning_head' closeButton>
                        <h3>Reserved Components</h3>
                    </ModalHeader>
                    <ModalBody>
                        { this.checkComponents() }
                        <Row className="justify-content-center container">
                            <Button className='checkout-button' disabled={ this.state.disabledButton }>
                                Return components
                            </Button>  
                        </Row>
                    </ModalBody>
                </Modal>
            </div>   
        )
    }
}

const mapStateToProps = (state) => {
    return { 
        addedItems: state.addedItems
    }
}

export default connect(mapStateToProps, null)(ReturningModal)
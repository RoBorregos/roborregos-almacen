import './ReturningModal.css';
import 'react-dropdown/style.css';

import { Button, Col, Row } from 'react-bootstrap';
import { Modal, ModalBody } from 'react-bootstrap';
import React, { Component } from 'react';

import ActiveComponents from '../../../data/active_components.json';
import Dropdown from 'react-dropdown';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ReturnedComponents from '../../../data/returned_components.json'
import { connect } from 'react-redux';

class ReturningModal extends Component { 
    constructor(props) {
        super(props);
        /** @type { string } */
        this.memberID = props.memberID;

        /** @type { number } */
        this.active_user_index = ActiveComponents.reservations.findIndex( reservation => reservation.memberID === this.memberID );

        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        this.user_components = (
            this.active_user_index === -1? 
            [] : 
            ActiveComponents.reservations[this.active_user_index].activeComponents
        );

        /** @type { number } */
        this.user_index_returned = props.user_index_returned;
        
        this.getLocalStoredComponents = this.getLocalStoredComponents.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.handleModalList = this.handleModalList.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.loadReserved = this.loadReserved.bind(this);
        this.returnComponents = this.returnComponents.bind(this);
        this.setJsonActiveComponents = this.setJsonActiveComponents.bind(this);   
        this.setLocalStorage = this.setLocalStorage.bind(this);

        this.state = {
            /** @type { number } */
            user_index_returned: this.user_index_returned,
            /** @type { boolean } */
            disabledButton: true,
            /** @type { boolean } */
            show: false,
            /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
            components: this.user_components
        }
    }

    generateNumbers( quantity ){
        const quantitys = [];
        for (let i = 0; i <= quantity; i++) {
            quantitys.push({
                key: String(i),
                text: String(i),
                value: String(i)
            });
        }
        return quantitys;
    }

    setLocalStorage( components ) {
        localStorage.setItem('components', JSON.stringify(components));
    }

    /*
    * Set the new active components list for the user
    */
   /** @param {nextComponents:!Array<{componentID:String, quantity: number}>, ...}>}*/
    setJsonActiveComponents( nextComponents ) {
        ActiveComponents.reservations[this.active_user_index].activeComponents = nextComponents;
    }

    // If index has changed because user had not history then we should update the index
    componentDidUpdate(prevProps) {
        if (this.props.user_index_returned !== prevProps.user_index_returned) {
          this.user_index_returned = this.props.user_index_returned;
          this.setState({ user_index_returned: this.user_index_returned })
        }
    }

    getLocalStoredComponents() {
        return JSON.parse(localStorage.getItem('components'));
    }

    /*
    Returns current date "in dd/mm/yyyy" format
    */
    getCurrentDate() {
        const today = new Date();
        const dd = today.getDate();
        let mm= today.getMonth()+1;
        mm = mm < 9 ? '0' + mm : mm;  
        const yyyy = today.getFullYear();
        return dd + '-' + mm + '-' + yyyy;
    }

    /* 
    Index is the index of the component that is going to modify its quantity (state) 
    */
    handleDropdownChange( newValue, index ) {
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const currentComponents = this.state.components;
        currentComponents[index].quantity = parseInt(newValue);    
        this.setState({ components: currentComponents });
    }

    /* 
    In case of closing the modal, set state to hidden and store components as they were initially 
    */
    handleClose() {
        if (this.active_user_index !== -1){
            /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
            const localStorageComponents = this.getLocalStoredComponents();
            this.setJsonActiveComponents(localStorageComponents);
            this.user_components = localStorageComponents;
            this.setState({ components: this.user_components });
        }
        this.setState({ show: false, disabledButton: true });
    }

    handleModalList() {
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const nextActiveComponents = [];
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const localStorageComponents = this.getLocalStoredComponents();
        
        this.state.components.forEach((component, index) => {
            if (component.quantity < localStorageComponents[index].quantity && component.quantity > 0) {
                const auxComponent = localStorageComponents[index];
                auxComponent.quantity -= component.quantity;
                nextActiveComponents.push(auxComponent);
            }
        })
        this.setState({
            show: false, 
            components: nextActiveComponents,
            disabledButton: true 
        });
        this.setJsonActiveComponents(nextActiveComponents);
        this.props.handleChangeReturned();
    }


    /* 
    Set the state of the modal and stores user active components 
    */
   handleShow() {
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const components = this.active_user_index === -1? [] : this.user_components;

        this.setLocalStorage(components);
        this.setState({ show: true });
    }

    /*
    Loads all components in an array of rows, each row is a component
    */
    loadReserved() {
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const componentsList = [];
        if (this.getLocalStoredComponents().length < this.user_components.length) {
            const optional = this.getLocalStoredComponents();
            for (let i = this.getLocalStoredComponents().length-1; i < this.user_components.length; i++) {
                optional.push(this.user_components[i]);
            }
            this.setLocalStorage(optional);
        }
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const localStorageComponents = this.getLocalStoredComponents();
        
        this.state.components.map((component, index) => 
            componentsList.push(
                <Row className='sin_comp_backg_r container bottom-buffer' key={ index }>
                        <Col xs='8' className='container pad-left5'>
                            <Col className='container'>
                                { component.componentID }
                            </Col>
                        </Col>
                        <Col xs='4' className='container'>
                            <Col xs='6' className='item-counter col-pd ver-center hor-center container'>
                                <div>
                                    { localStorageComponents[index].quantity }
                                </div>
                            </Col>
                            <Col xs='6' className='item-counter col-pd ver-center hor-center container'>
                                <div>
                                    <Dropdown
                                    placeholder={ String(this.state.components[index].quantity) }
                                    options={ this.generateNumbers( localStorageComponents[index].quantity ) }
                                    onChange={ (event) => this.handleDropdownChange(event.value, index) }
                                    />
                                </div>
                            </Col>
                        </Col>
                </Row>
            )
        );
        return componentsList;
    }

    /* 
    In case that our user has no components or has not ever made a reservation, 
    we have to throw a message, other case show reserved components table 
    */
    checkComponents() {
        if (this.active_user_index === -1 || this.state.components.length === 0){
            return (
                <div>
                    <h3> You have not active reserved components currently </h3>
                </div>
            )
        } else {
            return (
                <div>
                    <Row className="headers justify-content-center container bottom-buffer">
                            <Col xs='8' className="align-left container pad-left5">
                                <h5>Items</h5>
                            </Col>
                            <Col xs='4' className="align-left container pad-left5">
                                <Col xs='6' className="align-left container pad-left5">
                                    <h5>Total</h5>
                                </Col>
                                <Col xs='6' className="align-left container pad-left5">
                                    <h5>All</h5>
                                </Col>
                            </Col>
                    </Row>
                    { this.loadReserved() }
                </div>
            )
        } 
    }
    
    /*
    This method works when user clicks the button in the modal to return components, at the end modal closes
    */
    returnComponents() {
        /** @type { String } */
        const date = this.getCurrentDate();
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        let pushingComponents = [];
        
        this.state.components.forEach((component, index) => {
            if (component.quantity > 0) {
                pushingComponents.push({
                    'componentID': component.componentID,
                    'quantity': component.quantity,
                    'dateReturned': date
                })
            }
            return null;
        })
        // When there is not a register of user in returned components JSON (index === -1)
        if (this.state.user_index_returned === -1) {
            ReturnedComponents.records.push({
                'memberID': this.memberID,
                'returnedComponents': pushingComponents
            })
        } else {
            pushingComponents.forEach(e => {
                ReturnedComponents.records[this.user_index_returned].returnedComponents.push({
                    'componentID': e.componentID,
                    'quantity': e.quantity,
                    'dateReturned': date
                })
            })
        }
        this.handleModalList();
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
                            <Button className='checkout-button' 
                            disabled={ this.state.disabledButton } 
                            onClick={ () => this.returnComponents() }>
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
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
            /** @type {!Array<{componentID:String, quantity: number}>} */
            components: this.user_components
        }
    }

    /*
    * Generates an array that its propertys are for dropdown menu
    */
    /** @param {number} quantity */
    generateNumbers( quantity ){
        /** @type {!Array<{key: string, text:string, value: string}>} */
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

    /*
    * Sets the components in local storage
    */
    /** @param {!Array<{componentID:String, quantity: number}>} components */
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
    
    /*
    * Gets local stored components
    */
    getLocalStoredComponents() {
        return JSON.parse(localStorage.getItem('components'));
    }

    /*
    * Returns current date "in dd/mm/yyyy" format
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
    * Index is the index of the component that is going to modify its quantity (state) 
    */
    /** @param {number} newValue
    * @param {number} index */
    handleDropdownChange( newValue, index ) {
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const currentComponents = this.state.components;
        currentComponents[index].quantity = parseInt(newValue);
        const anyGreaterThanOne = (currentComponents.filter(x => x.quantity > 0).length > 0);
        this.setState({ components: currentComponents, disabledButton: !anyGreaterThanOne });
    }

    /* 
    * In case of closing the modal, set state to hidden and store components as they were initially 
    */
    handleClose() {
        if (this.active_user_index !== -1){
            /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
            const localStorageComponents = this.getLocalStoredComponents();
            this.setJsonActiveComponents(localStorageComponents);
            this.user_components = localStorageComponents;
        }
        this.setState({ show: false, disabledButton: true });
    }

    /* 
    * Method that updates the components in returning modal
    */
    handleModalList() {
        /** @type {!Array<{componentID:String, quantity: number}>} */
        const nextActiveComponents = [];
        /** @type {!Array<{componentID:String, quantity: number}>} */
        const localStorageComponents = this.getLocalStoredComponents();
        
        this.state.components.forEach((component, index) => {
            if (component.quantity < localStorageComponents[index].quantity) {
                /** @type {{componentID:String, quantity: number}} */
                const auxComponent = localStorageComponents[index];
                auxComponent.quantity -= component.quantity;
                nextActiveComponents.push(auxComponent);
            }
        })
        this.user_components = nextActiveComponents;
        this.setJsonActiveComponents(nextActiveComponents);
        this.setLocalStorage(nextActiveComponents);
        this.props.handleChangeReturned();
        this.setState({
            show: false,
            disabledButton: true,
            components: this.user_components
        });
    }


    /* 
    * Set the state of the modal and stores user active components 
    */
    handleShow() {
        /** @type {!Array<{componentID:String, quantity: number}>} */
        const components = this.active_user_index === -1? [] : this.user_components;
        this.setLocalStorage(components);
        /** @type {!Array<{componentID:String, quantity: number}>} */
        const copyOfComponents = this.user_components;
        copyOfComponents.map((component) => component.quantity = 0);
        this.setState({ components: copyOfComponents, show:true });
    }

    /*
    Loads all components in an array of rows, each row is a component
    */
    loadReserved() {
        /** @type {!Array<{componentID:String, quantity: number}>} */
        const componentsList = [];
        if (this.getLocalStoredComponents().length < this.user_components.length) {
            /** @type {!Array<{componentID:String, quantity: number}>} */
            const newLocalComponents = this.getLocalStoredComponents();
            for (let diff = this.getLocalStoredComponents().length-1; diff < this.user_components.length; diff++) {
                newLocalComponents.push(this.user_components[diff]);
            }
            this.setLocalStorage(newLocalComponents);
        }
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const localStorageComponents = this.getLocalStoredComponents();
        
        this.state.components.forEach((component, index) => {
            componentsList.push(
                <Row className='container bottom-buffer' key={ index }>
                        <Col xs='8' className='container pad-left5'>
                            <Col className={'container pad-left5'+
                            (this.state.components[index].quantity? ' blue-letters' : '')
                            }>
                                { component.componentID }
                            </Col>
                        </Col>
                        <Col xs='4' className='container'>
                            <Col xs='6' className='item-counter col-pd ver-center hor-center container pad-left5'>
                                <div className="current-gray">
                                    { localStorageComponents[index].quantity }
                                </div>
                            </Col>
                            <Col xs='6' className='item-counter col-pd ver-center hor-center container pad-left5'>
                                <div>
                                    <Dropdown className='dropdown'
                                    placeholder={ String(this.state.components[index].quantity) }
                                    options={ this.generateNumbers( localStorageComponents[index].quantity ) }
                                    onChange={ (event) => this.handleDropdownChange(event.value, index) }
                                    />
                                </div>
                            </Col>
                        </Col>
                </Row>
            )
            });
        return componentsList;
    }

    /* 
    * In case that our user has no components or has not ever made a reservation, 
    * we have to throw a message, other case show reserved components table 
    */
    checkComponents() {
        if (!this.getLocalStoredComponents() || this.getLocalStoredComponents().length === 0) {
            this.setLocalStorage(this.user_components);
        } 
        else if (this.getLocalStoredComponents().length < this.state.components.length) {
            /** @type {!Array<{componentID:String, quantity: number}>} */
            const optional = this.getLocalStoredComponents();
            for (let i = this.getLocalStoredComponents().length-1; i < this.user_components.length; i++) {
                optional.push(this.user_components[i]);
            }
            this.setLocalStorage(optional);
        }
        if (this.active_user_index === -1 || this.user_components.length === 0){
            return (
                <div>
                    <h3> You have not active reserved components currently </h3>
                </div>
            )
        } else {
            return (
                <div>
                    <Row className="justify-content-center container bottom-buffer title-row">
                            <Col xs='8' className="align-left container pad-left10">
                                <h5 className="quit-bottom">Items</h5>
                            </Col>
                            <Col xs='4' className="align-left container pad-left5">
                                <Col xs='6' className="align-left container pad-left5 col-text-centered">
                                    <h5 className="quit-bottom">Total</h5>
                                </Col>
                                <Col xs='6' className="align-left container pad-left5 col-text-centered">
                                    <div className="allRow">
                                        <h5 className="quit-bottom">All</h5>
                                    </div>
                                </Col>
                            </Col>
                    </Row>
                    { this.loadReserved() }
                </div>
            )
        } 
    }
    
    /*
    * This method works when user clicks the button in the modal to return components, at the end modal closes
    */
    returnComponents() {
        /** @type { String } */
        const date = this.getCurrentDate();
        /** @type {!Array<{componentID:String, quantity: number}>} */
        const pushingComponents = [];
        
        this.state.components.forEach((component, index) => {
            if (component.quantity > 0) {
                pushingComponents.push({
                    'componentID': component.componentID,
                    'quantity': component.quantity,
                    'dateReturned': date
                })
            }
        });
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
                    <Button className="return-button" onClick={ () => this.handleShow() }> 
                        Return components 
                    </Button>
                </Row>
                <Modal className='returning-modal'
                show={ this.state.show }
                onHide={ this.handleClose }
                >
                    <div className='topBlack'></div>
                    <ModalHeader className='returning_head' closeButton>
                        <h3>Return</h3>
                    </ModalHeader>
                    <ModalBody>
                        { this.checkComponents() }
                        <Row className="justify-content-center container button-row">
                                <Col xs={3}>
                                </Col>
                                <Col xs={3}>
                                    <Button className='checkout-button' 
                                    disabled={ this.state.disabledButton } 
                                    onClick={ () => this.returnComponents() }>
                                        Return
                                    </Button>  
                                </Col>
                                <Col xs={3}>
                                     <Button className='checkout-button'
                                    onClick={ () => this.handleClose() }>
                                        Back
                                    </Button>                
                                </Col>
                                <Col xs={3}>
                                </Col>
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
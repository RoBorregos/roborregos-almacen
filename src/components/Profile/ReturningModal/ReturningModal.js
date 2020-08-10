import './ReturningModal.css';

import { Button, Col, Row } from 'react-bootstrap';
import { Modal, ModalBody } from 'react-bootstrap';
import React, { Component } from 'react';

import ActiveComponents from '../../../data/active_components.json';
import Checkbox from '@material-ui/core/Checkbox';
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

        this.checkForSingleActiveComponent = this.checkForSingleActiveComponent.bind(this);
        this.handleCheckBox = this.handleCheckBox.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);
        this.handleIcrement = this.handleIcrement.bind(this);
        this.handleModalList = this.handleModalList.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.loadReserved = this.loadReserved.bind(this);
        this.returnComponents = this.returnComponents.bind(this);
        this.setJsonActiveComponents = this.setJsonActiveComponents.bind(this);        

        this.state = {
            /** @type { number } */
            user_index_returned: this.user_index_returned,
            /** @type { boolean } */
            disabledButton: true,
            /** @type { boolean } */
            show: false,
            /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
            components: this.user_components,
            /** @type {!Array<{ boolean }>, ...}>}*/
            isActive: new Array(this.user_components.length > 0? this.user_components.length : 0).fill(false)
        }
    }

    /*
    * Set the new active components list for the user
    */
   /** @param {nextComponents:!Array<{componentID:String, quantity: number}>, ...}>}*/
    setJsonActiveComponents( nextComponents ) {
        ActiveComponents.reservations[this.active_user_index].activeComponents = nextComponents;
    }
    
    /*
    * Check if there is at least one component active
    */
    checkForSingleActiveComponent() {
        return this.state.isActive.some(elem => elem === true);
    }

    // If index has changed because user had not history then we should update the index
    componentDidUpdate(prevProps) {
        if (this.props.user_index_returned !== prevProps.user_index_returned) {
          this.user_index_returned = this.props.user_index_returned;
          this.setState({ user_index_returned: this.user_index_returned })
        }
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
    When user clicks on the checkbox the components is confirmed that is going to be returned when clicks return components
    button inside the modal
    */
    /** @param {index:number}*/
    handleCheckBox( index ) {
        const copyOfChecked = this.state.isActive;
        copyOfChecked[index] = !copyOfChecked[index];
        this.setState({isActive: copyOfChecked, disabledButton: !this.checkForSingleActiveComponent()});
    }

    /* 
    Index of the component that is going to modify its quantity (state)
    It's necessary to check that we have not excced our components max reserved quantity 
    */
    /** @param {index: Number}*/
    handleIcrement( index ) { 
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const localStorageComponents = JSON.parse(localStorage.getItem('components'));
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const temporaryComponents = this.state.components;

        if (temporaryComponents[index].quantity < localStorageComponents[index].quantity)
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
    In case of closing the modal, set state to hidden and store components as they were initially 
    */
    handleClose() {
        if (this.active_user_index !== -1){
            /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
            const localStorageComponents = JSON.parse(localStorage.getItem('components'));
            this.setJsonActiveComponents(localStorageComponents);
            this.setState({ components: localStorageComponents})
        }
        this.setState({ show: false, disabledButton: true });
    }

    handleModalList() {
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const nextActiveComponents = [];
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const localStorageComponents = JSON.parse(localStorage.getItem('components'));
        
        this.state.components.forEach((component, index) => {
            if (this.state.isActive[index] === false) {
                nextActiveComponents.push(localStorageComponents[index]);
            } else if (component.quantity < localStorageComponents[index].quantity) {
                const auxComponent = localStorageComponents[index];
                auxComponent.quantity -= component.quantity;
                nextActiveComponents.push(auxComponent);
            }
        })
        this.setState({
            show: false, 
            components: nextActiveComponents, 
            isActive: new Array(nextActiveComponents.length).fill(false), 
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

        localStorage.setItem('components', JSON.stringify(components));
        this.setState({ show: true })
    }

    /*
    Loads all components in an array of rows, each row is a component
    */
    loadReserved() {
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        const componentsList = [];

        this.state.components.map((component, index) => 
            componentsList.push(
                <Row className='sin_comp_backg_r container bottom-buffer' key={ index }>
                        <Col xs='6' className='container pad-left5'>
                            <Col className='container'>
                                { component.componentID }
                            </Col>
                        </Col>
                        <Col xs='6' className='container'>
                            <Col xs='2' className='col-pd hor-center align-items-center container'>
                                <Button className='subt-button' 
                                onClick={ () => this.handleDecrement(index) }
                                >
                                -
                                </Button>
                            </Col>
                            <Col xs='4' className='item-counter col-pd ver-center hor-center container'>
                                <div className="input-group-field">
                                    { component.quantity }
                                </div>
                            </Col>
                            <Col xs='2' className='col-pd hor-center align-items-center container'>
                                <Button className='add-button' 
                                onClick={ () => this.handleIcrement(index) }
                                >
                                +
                                </Button>
                            </Col>
                            <Col xs='4' className='col-pd hor-center align-items-center container'>
                                <Checkbox className='checkbox' onClick= { () => this.handleCheckBox(index) }/>
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
    
    /*
    This method works when user clicks the button in the modal to return components, at the end modal closes
    */
    returnComponents() {
        /** @type { String } */
        const date = this.getCurrentDate();
        /** @type {!Array<{componentID:String, quantity: number}>, ...}>}*/
        let pushingComponents = [];
        
        this.state.components.forEach((component, index) => {
            if (this.state.isActive[index] === true && component.quantity > 0){
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
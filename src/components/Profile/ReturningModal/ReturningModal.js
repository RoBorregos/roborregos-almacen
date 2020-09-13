import './ReturningModal.css';
import 'react-dropdown/style.css';

import { Button, Col, Row } from 'react-bootstrap';
import { Modal, ModalBody } from 'react-bootstrap';
import React, { Component } from 'react';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import ActiveComponents from '../../../data/active_components.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
        
        this.checkComponentLimit = this.checkComponentLimit.bind(this);

        this.getLocalStoredComponents = this.getLocalStoredComponents.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);
        this.selectAllAndReturn = this.selectAllAndReturn.bind(this);
        this.handleIncrement = this.handleIncrement.bind(this);
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

    checkComponentLimit( index ){
        const localComponents = this.getLocalStoredComponents();
        return localComponents[index].quantity > this.state.components[index].quantity;
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

    handleIncrement( index ) {
        const currentComponents = this.state.components;
        const localComponents = this.getLocalStoredComponents();
        if( currentComponents[index].quantity < localComponents[index].quantity ){
            currentComponents[index].quantity++;
        }
        const anyGreaterThanOne = (currentComponents.filter(x => x.quantity > 0).length > 0);
        this.setState({ components: currentComponents, disabledButton: !anyGreaterThanOne });
    }

    handleDecrement( index ) {
        const currentComponents = this.state.components;
        if( currentComponents[index].quantity > 0 ){
            currentComponents[index].quantity--;
        }
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
                <Row className='container bottom-buffer' key={ index } style={{ userSelect: 'none' }}>
                        <Col className='container pad-left5'>
                            <Col className={'container pad-left5'+
                            (this.state.components[index].quantity? ' blue-letters' : '')}>
                                { component.componentID }
                            </Col>
                        </Col>
                        <Col className='container'>
                            <Col className='item-counter col-pd ver-center hor-center container pad-left5'>
                                { localStorageComponents[index].quantity }
                            </Col>
                            <Col className='item-counter col-pd ver-center hor-center container pad-left5'>
                                <Col xs={4}>
                                    <FontAwesomeIcon icon={ faMinus } 
                                    style={{ color: this.state.components[index].quantity>0? '#33e1ff' : '#2d2d2d' }} 
                                    onClick={ () => this.handleDecrement( index ) }></FontAwesomeIcon> 
                                </Col>
                                <Col xs={2} className='no-hor-padding'>
                                    { this.state.components[index].quantity }
                                </Col>
                                <Col xs={4}>
                                    <FontAwesomeIcon icon={ faPlus } style={{ color: this.checkComponentLimit( index )? '#fd7e14' : '#2d2d2d' }} 
                                    onClick={ () => this.handleIncrement( index ) }></FontAwesomeIcon>
                                </Col>
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
                <div className='pad-hor-15'>
                    <h3 className='text-justify'> You have not active reserved components currently </h3>
                </div>  
            )
        } else {
            return (
                <div>
                    <Row className="justify-content-center container bottom-buffer">
                            <Col className="align-left container pad-left10">
                                <h4 className="quit-bottom">Component</h4>
                            </Col>
                            <Col className="align-left container pad-left5">
                                <Col className="align-left container pad-left5 col-text-centered">
                                    <h4 className="quit-bottom">Reserved</h4>
                                </Col>
                                <Col className="align-left container pad-left5 col-text-centered">
                                    <h4 className="quit-bottom">Quantity</h4>
                                </Col>
                            </Col>
                    </Row>
                    { this.loadReserved() }
                </div>
            )
        } 
    }

    selectAllAndReturn(){
        const currentComponents = this.state.components;
        const localComponents = this.getLocalStoredComponents();
        currentComponents.forEach( (component, index) => {
            component.quantity = localComponents[index].quantity;
        })
        this.setState({ components: currentComponents });
        console.log(this.state.components);
        this.returnComponents();
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
                style={{ backgroundColor: 'rgba(121,134,136,0.59)' }}
                >
                    <ModalHeader className='returning_head' closeButton>
                        <Col xs={ 6 } className='offset-3'>
                            <h2 className='title-row'>Return</h2>
                        </Col>
                    </ModalHeader>
                    <ModalBody>
                        { this.checkComponents() }
                        <Row className="justify-content-center container button-row">
                                <Col xs={3} className='offset-6'>
                                    <Button className='checkout-button return-all'
                                    onClick={ () => this.selectAllAndReturn() }>
                                        Return All
                                    </Button>                
                                </Col>
                                <Col xs={3}>
                                    <Button className='checkout-button' 
                                    disabled={ this.state.disabledButton } 
                                    onClick={ () => this.returnComponents() }>
                                        Return
                                    </Button>  
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
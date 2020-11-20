import './ReturningModal.css';

import { Button, Col, Row } from 'react-bootstrap';
import { Modal, ModalBody } from 'react-bootstrap';
import React, { Component } from 'react';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalHeader from 'react-bootstrap/ModalHeader';
import { showCurrent, updateReservation } from 'scripts/apiScripts.js';
import QrCode from 'components/QrCode/QrCode.js';

class ReturningModal extends Component { 
    constructor(props) {
        super(props);
        this.checkComponentLimit = this.checkComponentLimit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);
        this.handleIncrement = this.handleIncrement.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleChangeReturned = this.props.handleChangeReturned.bind(this);

        this.returnComponents = this.returnComponents.bind(this);
        
        /** @type {!Array<{id: number, details: {!Array<{component_id: number, component_uuid: String, quantity: number
             * , created_date: String, returned_date: String}}, created_date: String, returned_date: String}>} */            
        this.activeComponents = [];
        
        this.state = {
            showQR: false,
            idQR: '',
            /** @type {!Array<{id: number, details: {!Array<{component_id: number, component_uuid: String, quantity: number
             * , created_date: String, returned_date: String}}, created_date: String, returned_date: String}>} */
            components: [],
            show: false,
            disabledButton: false
        }
    }

    async componentDidMount(){
        const currentComponents = await showCurrent();
        this.activeComponents = [];
        for( let index = 0; index < currentComponents.data.length; ++index) {
            this.activeComponents.push(currentComponents.data[index].quantity);
        }
        this.setState({ components: currentComponents.data});
    }

    /*
    * Checks if we have reached the max quantity that we can return in a single component.
    */
    /** @param { number } index */
    checkComponentLimit(index) {
        return this.activeComponents[index] === this.state.components[index].quantity;
    }

    
    /*
    * Returns current date "in dd/mm/yyyy" format.
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
    * Handle a quantity increment in the state of active component.
    */
    /** @param {number} index */
    handleIncrement(index) {
        /** @type {!Array<{componentID:String, quantity: number}>} */
        const currentComponents = this.state.components;
        /** @type {!Array<{componentID:String, quantity: number}>} */
        if (currentComponents[index].quantity < this.activeComponents[index]) {
            currentComponents[index].quantity++;
        }
        const anyGreaterThanOne = (currentComponents.filter(x => x.quantity > 0).length > 0);
        this.setState({ components: currentComponents, disabledButton: !anyGreaterThanOne });
    }

    /*
    * Handle a quantity decrement in the state of active component.
    */
    /** @param {number} index */
    handleDecrement(index) {
        /** @type {!Array<{componentID:String, quantity: number}>} */
        const currentComponents = this.state.components;
        if (currentComponents[index].quantity > 0) {
            currentComponents[index].quantity--;
        }
        /** @type {boolean} */
        const anyGreaterThanOne = (currentComponents.filter(x => x.quantity > 0).length > 0);
        this.setState({ components: currentComponents, disabledButton: !anyGreaterThanOne });
    }

    /* 
    * In case of closing the modal, set state to hidden.
    */
    handleClose() {
        this.setState({ show: false, disabledButton: true, showQR: false, idQR : '' });
    }


    /* 
    * Set the state of the modal.
    */
    handleShow() {
        this.setState({ show:true, disabledButton: false });
    }

    /*
    * Loads all components in an array of rows, each row is a active component.
    */
    loadReserved() {
        return this.state.components.map((component, index) => (
            <Row className='container bottom-buffer' key={ component.component_id } style={{ userSelect: 'none' }}>
                    <Col xs={ 4 } sm={ 6 } className='container pad-left5'>
                        <Col className={'container pad-left5' +
                        (component.quantity ? ' blue-letters' : '')}>
                            { component.component_name }
                        </Col>
                    </Col>
                    <Col xs={ 8 } sm={ 6 } className='container'>
                        <Col xs={ 6 } className='item-counter col-pd ver-center hor-center container pad-left5'>
                            { this.activeComponents[index] }
                        </Col>
                        <Col xs={ 6 } className='item-counter col-pd ver-center hor-center container pad-left5'>
                            <Col xs={ 4 } className='no-hor-padding'>
                                <FontAwesomeIcon icon={ faMinus } 
                                style={{ color: (component.quantity > 0? '#33e1ff' : '#2d2d2d') }} 
                                onClick={ () => this.handleDecrement(index) }></FontAwesomeIcon> 
                            </Col>
                            <Col xs={ 2 } className='no-hor-padding'>
                                { component.quantity }
                            </Col>
                            <Col xs={ 4 }>
                                <FontAwesomeIcon icon={ faPlus } 
                                style={{ color: this.checkComponentLimit(index)? '#2d2d2d' : '#fd7e14' }} 
                                onClick={ () => this.handleIncrement(index) }></FontAwesomeIcon>
                            </Col>
                        </Col>
                    </Col>
            </Row>
        ));
    }

    /* 
    * In case that our user has no components or has not ever made a reservation, 
    * we have to throw a message, other case show reserved components table 
    */
    checkComponents() {
        if (this.state.components.length === 0) {
            return (
                <div className='pad-hor-15'>
                    <h3 className='text-justify'> You have not active reserved components currently </h3>
                </div>  
            )
        } else {
            return (
                <div>
                    <Row className="justify-content-center container bottom-buffer title-row">
                            <Col xs={ 4 } sm={ 6 } className="align-left container pad-left10">
                                Component
                            </Col>
                            <Col xs={ 8 } sm={ 6 } className="align-left container pad-left5">
                                <Col className="align-left container pad-left5 col-text-centered">
                                    Reserved
                                </Col>
                                <Col className="align-left container pad-left5 col-text-centered">
                                    Quantity
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
    async returnComponents(returnAll) {
        let components = [];
        for( let index = 0; index < this.activeComponents.length; ++index) {
            components.push(
                { 
                    component: this.state.components[index].component_id,
                    quantity: returnAll ? this.activeComponents[index] : this.state.components[index].quantity
                }
            );
        }
        
        const returnData = await updateReservation(components);
        const returnUUID = returnData.data.uuid;

        await this.handleChangeReturned();

        const currentComponents = await showCurrent();
        this.activeComponents = [];
        for( let index = 0; index < currentComponents.data.length; ++index) {
            this.activeComponents.push(currentComponents.data[index].quantity);
        }
        this.setState({ components: currentComponents.data, showQR: true, idQR:returnUUID});
    }

    render() {
        if (this.state.showQR) {
            return (
                    <Modal className='returning-modal'
                    show={ this.state.show }
                    onHide={ this.handleClose }
                    >
                        <ModalHeader className='returning_head' closeButton>
                            <Col xs={ 6 } className='offset-3'>
                                <h2 className='blue-letters'>Save return QR</h2>
                            </Col>
                        </ModalHeader>
                        <ModalBody>
                            {/* { this.checkComponents() } */}
                            <Col className='qrcode-container'>
                                <Row className='justify-content-center mb-4'>
                                    Save your QRcode!!
                                </Row>
                                <Row className='justify-content-center'>
                                    <QrCode idQR={ this.state.idQR } />
                                </Row>
                            </Col>
                        </ModalBody>
                    </Modal>
            );
        } else{
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
                        <ModalHeader className='returning_head' closeButton>
                            <Col xs={ 6 } className='offset-3'>
                                <h2 className='blue-letters'>Return</h2>
                            </Col>
                        </ModalHeader>
                        <ModalBody>
                            { this.checkComponents() }
                            <Row className="justify-content-center container button-row">
                                <Col xs={ 6 } sm={ 5 } className='offset-sm-4 return-all-container'>
                                    <Button className='checkout-button return-all'
                                    onClick={ () => this.returnComponents(true) }>
                                        Return All
                                    </Button>                
                                </Col>
                                <Col xs={ 6 } sm={ 3 }>
                                    <Button className='checkout-button' 
                                    disabled={ this.state.disabledButton } 
                                    onClick={ () => this.returnComponents(false) }>
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
}

export default ReturningModal;
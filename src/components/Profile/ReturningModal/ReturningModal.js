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
        this.usr_index = ActiveComponents.reservations.findIndex( reservation => reservation.memberID === this.memberID );

        /** @type { array of objects } */
        this.user_components = (
            this.usr_index === -1? 
            null : 
            ActiveComponents.reservations[this.usr_index].activeComponents
        );

        /** @return { void } */
        this.handleIcrement = this.handleIcrement.bind(this);

        /** @return { void } */
        this.handleDecrement = this.handleDecrement.bind(this);

        /** @return { void } */
        this.handleShow = this.handleShow.bind(this);
 
        /** @return { void } */
        this.handleClose = this.handleClose.bind(this);

        /** @return { array } */
        this.loadReserved = this.loadReserved.bind(this);

        
        this.state = { 
            /** @type { boolean } */
            show: false,
            /** @type { array of objects } */
            components: this.user_components
        }
    }

    /* Index is the index of the component that is going to modify its quantity (state)
    It's necessary to check that we have not excced our components max reserved quantity */
    handleIcrement( index ) { 
        /** @type { array of objects } */
        let check = JSON.parse(localStorage.getItem('components'));
        /** @type { array of objects } */
        let temp = this.state.components;

        if(temp[index].quantity < check[index].quantity)
            temp[index].quantity++;

        this.setState({ components: temp });
    }

    /* Index is the index of the component that is going to modify its quantity (state) */
    handleDecrement( index ) { 
        /** @type { array of objects} */
        let temp = this.state.components;

        if (temp[index].quantity > 0)
            temp[index].quantity--;
            
        this.setState({ components: temp });
    }

    /* Set the state of the modal and stores user active components */
    handleShow() { 
        /** @type { array of objects} */
        let check = ActiveComponents.reservations[this.usr_index].activeComponents;

        localStorage.setItem('components', JSON.stringify(check));
        this.setState({ show: true })
    }

    /* In case of closing the modal, set state to hidden and store components as they were initially */
    handleClose() { 
        /** @type { array of objects } */
        let check = JSON.parse(localStorage.getItem('components'));

        ActiveComponents.reservations[this.usr_index].activeComponents = check;
        this.setState({ components: check, show: false })
    }

    /* Loads all components in an array of rows, each row is a component */
    loadReserved() {
        /** @type { array of objects } */
        let componentsList = [];

        for (let i = 0; i < this.state.components.length; i++) { 
            componentsList.push(
                <Row className='sin_comp_backg_r container bottom-buffer'>
                        <Col xs='6' className='container pad-left5'>
                            <Col className='container'>
                                { this.state.components[i].componentID }
                            </Col>
                        </Col>
                        <Col xs='6' className='container'>
                            <Col xs='2' className='col-pd hor-center align-items-center container'>
                                <Button className='subt-button' 
                                onClick={ () => this.handleDecrement(i) }
                                >
                                -
                                </Button>
                            </Col>
                            <Col xs='4' className='item-counter col-pd ver-center hor-center container'>
                                <div className="input-group-field">
                                    { this.state.components[i].quantity }
                                </div>
                            </Col>
                            <Col xs='2' className='col-pd hor-center align-items-center container'>
                                <Button className='add-button' 
                                onClick={ () => this.handleIcrement(i) }
                                >
                                +
                                </Button>
                            </Col>
                            <Col xs='4' className='col-pd hor-center align-items-center container'>
                                <Checkbox className='checkbox' />
                            </Col>
                        </Col>
                </Row>
            );
        }
        return componentsList;
    }

    /* In case that our user has no components or has not ever made a reservation, 
    we have to throw a message, other case show reserved components table */
    checkComponents() { 
        if(this.usr_index === -1 || this.user_components.length === 0){
            return (
                <div>
                    <h3> You have not active reserved components currently </h3>
                </div>
            )
        }
        else return (
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


    render(){
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
                            <Button className='checkout-button'>
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
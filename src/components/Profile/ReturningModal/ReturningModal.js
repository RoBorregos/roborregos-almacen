import './ReturningModal.css';

import { Button, Col, Row } from 'react-bootstrap';
import { Modal, ModalBody } from 'react-bootstrap';
import React, { Component } from 'react';
import { addQuantity, clearCart, removeItem, subtractQuantity, types } from '../../../scripts/cartReducer';

import ActiveComponents from '../../../data/active_components.json';
import ModalHeader from 'react-bootstrap/ModalHeader';
import { connect } from 'react-redux';

class ReturningModal extends Component {
    constructor(props) {
        super(props);
        this.memberID = props.memberID;
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.active_components = ActiveComponents; 
        this.loadReserved = this.loadReserved.bind(this);
        this.state = {
            show: false
        }
    }

    handleShow() {
        this.setState({ show: true })
    }
    
    handleClose() {
        this.setState({ show: false })
    }

    loadReserved() {

        let componentsList = [];
        let countComponents = 0;
        for (let reserved = 0; reserved < this.active_components.reservations.length; reserved++) {
            if (this.active_components.reservations[reserved].memberID !== this.memberID) continue;
            let componentsArray = this.active_components.reservations[reserved].activeComponents;
            for (let i = 0; i < componentsArray.length; i++) {
                let style = (countComponents % 2 === 0) ? "oddRow" : "evenRow";
                componentsList.push(
                    <Row className={ style }>
                            <Col xs='6'>
                                <Col className="reservations">{componentsArray[i].componentID}</Col>
                            </Col>
                            <Col xs='6'>
                                <Col xs='3' className='col-pd hor-center'>
                                    <Button className='subt-button'>-</Button>
                                </Col>
                                <Col xs='3' className='item-counter col-pd ver-center hor-center'>
                                    <div className="input-group-field">{componentsArray[i].quantity}</div>
                                </Col>
                                <Col xs='3' className='col-pd hor-center'>
                                    <Button className='add-button'>+</Button>
                                </Col>
                                <Col xs='3' className='col-pd hor-center'>
                                    <Button className='rem-button'>x</Button>
                                </Col>
                            </Col>
                    </Row>
                );
                countComponents++;
            }
        }
        return componentsList;
    }

    render(){
        return(
            <div onClick={e => e.stopPropagation()}>
                <Button onClick={ () => this.handleShow() }> 
                    Click here to return components 
                </Button>
                <Modal
                show={this.state.show}
                onHide={this.handleClose}
                >
                    <ModalHeader className='returning_head' closeButton><h3>Reserved Components</h3></ModalHeader>
                    <ModalBody>
                        <Row className="justify-content-center">
                                <Col className="headers justify-content-center">
                                    <h5>Component</h5>
                                </Col>
                                <Col className="headers justify-content-center">
                                    <h5>Quantity</h5>
                                </Col>
                        </Row>
                        {this.loadReserved()}
                        <Row className="justify-content-center">
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
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
        this.memberID = props.memberID;
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.loadReserved = this.loadReserved.bind(this);
        this.usr_index = ActiveComponents.reservations.findIndex( reservation => reservation.memberID === this.memberID );
        this.user_components = this.usr_index === -1? null : ActiveComponents.reservations[this.usr_index].activeComponents; 
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

        for (let i = 0; i < this.user_components.length; i++) {
            let style = (countComponents % 2 === 0) ? "oddRow" : "evenRow";
            componentsList.push(
                <Row className={ style }>
                        <Col xs='6'>
                            <Col className="reservations">{this.user_components[i].componentID}</Col>
                        </Col>
                        <Col xs='6' className='ver-center'>
                            <Col xs='3' className='col-pd hor-center'>
                                <Button className='subt-button'>-</Button>
                            </Col>
                            <Col xs='3' className='item-counter col-pd ver-center hor-center'>
                                <div className="input-group-field">{this.user_components[i].quantity}</div>
                            </Col>
                            <Col xs='3' className='col-pd hor-center'>
                                <Button className='add-button'>+</Button>
                            </Col>
                            <Col xs='3' className='col-pd hor-center'>
                                <Checkbox className='checkbox' />
                            </Col>
                        </Col>
                </Row>
            );
            countComponents++;
        }
        return componentsList;
    }

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
                <Row className="justify-content-center">
                                <Col className="headers justify-content-center">
                                    <h5>Component</h5>
                                </Col>
                                <Col className="headers justify-content-center">
                                    <h5>Quantity</h5>
                                </Col>
                </Row>
                {this.loadReserved()}
            </div>
        )
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
                        {this.checkComponents()} 
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
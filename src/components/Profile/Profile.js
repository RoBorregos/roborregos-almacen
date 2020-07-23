import './Profile.css';

import { Button, Col, Row } from 'react-bootstrap';
import { Modal, ModalBody } from 'react-bootstrap';
import React, { Component } from 'react';
import { addQuantity, clearCart, removeItem, subtractQuantity, types } from '../../scripts/cartReducer';

import ActiveComponents from '../../data/active_components.json';
import ModalHeader from 'react-bootstrap/ModalHeader';
import { connect } from 'react-redux';
import members from '../../data/members.json';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.member = members.members[0]
        this.mock_reservations = props.mock_reservations;
        this.active_components = ActiveComponents;

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.loadMember = this.loadMember.bind(this);
        this.loadReservations = this.loadReservations.bind(this);
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

    loadMember() {
        return (
            <div className="member">
                <Row >
                    <Col>{this.member.name}</Col>
                    <Col>{this.member.mail}</Col>
                    <Col>{this.member.memberID}</Col>
                </Row>
            </div>
        );
    }

    loadReservations() {

        let componentsList = [];
        let countComponents = 0;
        for (let reservations = 0; reservations < this.mock_reservations.length; reservations++) {
            let reservationArray = this.mock_reservations[reservations].reservation;
            for (let i = 0; i < reservationArray.length; i++) {
                let style = (countComponents % 2 === 0) ? "oddRow" : "evenRow";
                componentsList.push(
                    <div>
                        <Row className={ style }>
                            <Col className="reservations">{this.mock_reservations[reservations].date}</Col>
                            <Col className="reservations">{reservationArray[i].componentID}</Col>
                            <Col className="reservations">{reservationArray[i].quantity}</Col>
                        </Row>
                    </div>
                );
                countComponents++;
            }

        }
        return componentsList;
    }

    loadReserved() {

        let componentsList = [];
        let countComponents = 0;
        for (let reserved = 0; reserved < this.active_components.reservations.length; reserved++) {
            if (this.active_components.reservations[reserved].memberID !== this.member.memberID) continue;
            let componentsArray = this.active_components.reservations[reserved].activeComponents;
            for (let i = 0; i < componentsArray.length; i++) {
                let style = (countComponents % 2 === 0) ? "oddRow" : "evenRow";
                componentsList.push(
                    <div>
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
                    </div>
                );
                countComponents++;
            }
        }
        return componentsList;
    }

    render() {
        return (
            <div className="profile_container">
                <Col >
                    <h1>Your Reservations</h1>
                </Col>
                <Col>
                    <Col>
                        <Row className="justify-content-center">
                            <Col className="headers justify-content-center">
                                <h2>Date</h2>
                            </Col>
                            <Col className="headers justify-content-center">
                                <h2>Component</h2>
                            </Col>
                            <Col className="headers justify-content-center">
                                <h2>Quantity</h2>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        {this.loadReservations()}
                    </Col>
                </Col>
                <Col>
                    <Button onClick={this.handleShow}> Click here to return components </Button>
                    <div onClick={e => e.stopPropagation()}>
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
                            </ModalBody>
                        </Modal>
                    </div>
                </Col>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addedItems: state.addedItems
    }
}

export default connect(mapStateToProps, null)(Profile);
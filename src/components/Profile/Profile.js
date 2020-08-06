import './Profile.css';

import { Col, Row } from 'react-bootstrap';
import React, { Component } from 'react';

import ReturningModal from './ReturningModal/ReturningModal';
import { connect } from 'react-redux';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.memberID = props.memberID ;
        this.mock_reservations = props.mock_reservations;
        this.loadReservations = this.loadReservations.bind(this);
    }

    handleModalState() {
        this.modalEnabled = !this.modalEnabled;
    }

    loadReservations() {
        return(
            this.mock_reservations.map((eachReservation) => {
                if ( eachReservation.memberID === this.memberID ) {
                    return (
                        <div key={eachReservation.reservation_key}>
                            {eachReservation.reservation.map((eachComponent, index) => {
                            return (
                                <div>
                                    <Row className={ (index % 2 === 0 ? "oddRow" : "evenRow") } key={ eachComponent.index }>
                                        <Col className="reservations">{eachReservation.date}</Col>
                                        <Col className="reservations">{eachComponent.componentID}</Col>
                                        <Col className="reservations">{eachComponent.quantity}</Col>
                                    </Row>
                                </div>
                            )
                            })}   
                        </div>
                    )
                }
                return null;
            })
        )
    }

    render() {
        return (
            <div className="profile_container">
                <Col >
                    <h1>Your Reservations</h1>
                </Col>
                <Col>
                    <Col>
                        <Row className="first-row justify-content-center">
                            <Col className="justify-content-center">
                                <h2>Date</h2>
                            </Col>
                            <Col className="justify-content-center">
                                <h2>Component</h2>
                            </Col>
                            <Col className="justify-content-center">
                                <h2>Quantity</h2>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        {this.loadReservations()}
                    </Col>
                </Col>
                <Col>
                    <ReturningModal memberID={ this.memberID } />  
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
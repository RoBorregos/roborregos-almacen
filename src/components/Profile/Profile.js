import './Profile.css';

import { Button, Col, Row } from 'react-bootstrap';
import React, { Component } from 'react';

import { connect } from 'react-redux';
import members from '../../data/members.json';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.member = members.members[0]
        this.mock_reservations = props.mock_reservations;

        this.loadMember = this.loadMember.bind(this);
        this.loadReservations = this.loadReservations.bind(this);
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
                    <Button> Click here to return components </Button>
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
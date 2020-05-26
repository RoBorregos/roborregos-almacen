import React, { Component } from 'react';
import './Profile.css';
import members from '../../data/members.json';
import { Row, Col } from 'react-bootstrap';


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
        for (let reservations = 0; reservations < this.mock_reservations.length; reservations++) {

            let reservationArray = this.mock_reservations[reservations].reservation;
            for (let i = 0; i < reservationArray.length; i++) {
                let style = (i % 2 === 0) ? "lightgray" : "white";
                componentsList.push(
                    <div>
                        <Row className="justify-content-sm-left">
                            <Col className="reservations" style={{ backgroundColor: style }}>{this.mock_reservations[reservations].date}</Col>
                            <Col className="reservations" style={{ backgroundColor: style }}>{reservationArray[i].componentID}</Col>
                            <Col className="reservations" style={{ backgroundColor: style }}>{reservationArray[i].quantity}</Col>
                        </Row>
                    </div>
                );
            }

        }
        return componentsList;
    }

    render() {
        return (
            <div className="profile_container">

                <Col>
                    <h1>User</h1>
                    {this.loadMember()}
                </Col>

                <br />

                <Col >
                    <h1>Reservations</h1>
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

            </div>
        );
    }
}





export default Profile;
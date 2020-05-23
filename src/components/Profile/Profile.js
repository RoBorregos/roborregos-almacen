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
            <div>
                <p>{ "Nombre: " + this.member.name }</p>
                <p>{ "Mail: " + this.member.mail }</p>
                <p>{ "Matricula: " + this.member.memberID }</p>
            </div>
        );
    }

    loadReservations(){
        
        let reservationArray = this.mock_reservations[0].reservation;
        let componentsList=[];
        for(let i=0; i<reservationArray.length; i++) {
            componentsList.push(
                <Row className="justify-content-sm-left">
                    <Col >{ "Material: " + reservationArray[i].componentID }</Col>
                    <Col>{ "Quantity: " + reservationArray[i].quantity  }</Col>
                </Row>
            );
        }
        return componentsList;
    }

    render() {
        return (
                <div className="profile_container">
                    <h2>Profile</h2>
                    <div className="profileBox">
                        { this.loadMember() }
                    </div>

                    <div className="cartBox">
                        <h1>Rented components</h1>
                            <Col>
                                { this.loadReservations() }
                            </Col>
                    </div>
                </div>
        );
    }
}





export default Profile;
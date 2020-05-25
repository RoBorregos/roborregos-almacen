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
           <Row >
            <Col>{ "NOMBRE: " + this.member.name  }</Col>
            <Col>{"MAIL: " + this.member.mail}</Col>
            <Col>{"MATRICULA: " + this.member.memberID}</Col>


            </Row> 
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
                      
                    
                      <Col> 
                         <h3>Profile</h3> 
                      </Col>
                     
                     
                      <Col>  
                         { this.loadMember() }
                      </Col>
                    
                      <Col> 
                         <h3>Rented components</h3>
                      </Col>

                      <Col>
                         { this.loadReservations() }
                      </Col>

                   
                    
                </div>
        );
    }
}





export default Profile;
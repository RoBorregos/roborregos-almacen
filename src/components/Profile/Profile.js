import './Profile.css';

import { Col, Row } from 'react-bootstrap';
import React, { Component } from 'react';

import ReturnedComponents from '../../data/returned_components.json'
import ReturningModal from './ReturningModal/ReturningModal';
import { connect } from 'react-redux';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.memberID = props.memberID;
        this.user_index_returned = ReturnedComponents.records.findIndex( 
            reservation => reservation.memberID === this.memberID 
        );
        this.returned_components = (
            this.user_index_returned === -1? 
            null : 
            ReturnedComponents.records[this.user_index_returned].returnedComponents
        );
        this.mock_reservations = props.mock_reservations;
        this.loadReservations = this.loadReservations.bind(this);
        this.loadReturned = this.loadReturned.bind(this);
        this.handleChangeReturned = this.handleChangeReturned.bind(this);

        this.state = {
            returned_user_index: this.user_index_returned,
            returnedComponents: this.returned_components
        }
    }
    
    handleChangeReturned() {
        if(this.state.returned_user_index === -1) {
            this.user_index_returned = ReturnedComponents.records.findIndex(
                 reservation => reservation.memberID === this.memberID 
            );
        }
        this.returned_components = ReturnedComponents.records[this.user_index_returned].returnedComponents;
        this.setState({ returned_user_index: this.user_index_returned, 
            returnedComponents: this.returned_components });
    }

    loadReturned() {
        if(this.user_index_returned !== -1) {
            return (
                <div>
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
                        {
                            this.state.returnedComponents.map((component, index) => {
                                return (
                                    <div key={ index }>
                                        <Row className={ (index % 2 === 0 ? "oddRow" : "evenRow") }>
                                            <Col className="reservations">{ component.dateReturned }</Col>
                                            <Col className="reservations">{ component.componentID }</Col>
                                            <Col className="reservations">{ component.quantity }</Col>
                                        </Row>
                                    </div>
                                )
                            })
                        }
                    </Col>
                </div>
            )
        } else {
            return (
                <h3>You have not returned any component</h3>
            )
        }
    }

    loadReservations() {
        if(this.mock_reservations.findIndex((each) =>  each.memberID === this.memberID) !== -1) {
            return(
                <div>
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
                        {
                            this.mock_reservations.map((eachReservation) => {
                            if( eachReservation.memberID === this.memberID ) {
                                return (
                                    <div key={ eachReservation.reservation_key }>
                                        { eachReservation.reservation.map((eachComponent, index) => {
                                        return (
                                            <div key={ index }>
                                                <Row className={ (index % 2 === 0 ? "oddRow" : "evenRow") }>
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
                        }
                    </Col>
                </div>
            )
        } else {
            return (
                <h3>You have not done any reservations</h3>
            )
        }
    }

    render() {
        return (
            <div className="profile_container">
                <Col >
                    <h1>Your Reservations</h1>
                </Col>
                <Col>
                    { this.loadReservations() }
                </Col>
                <Col >
                    <h1>Your returned components</h1>
                </Col>
                <Col>
                    { this.loadReturned() }
                </Col>
                <Col>
                    <ReturningModal memberID={ this.memberID } 
                    user_index_returned={ this.user_index_returned }
                    handleChangeReturned={ this.handleChangeReturned }/>  
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
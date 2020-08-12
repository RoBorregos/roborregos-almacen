import './Profile.css';

import { Col, Row } from 'react-bootstrap';
import React, { Component } from 'react';

import ReturnedComponents from '../../data/returned_components.json'
import ReturningModal from './ReturningModal/ReturningModal';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { connect } from 'react-redux';

class Profile extends Component {
    constructor(props) {
        super(props);
        /** @type { String } */
        this.memberID = props.memberID;
        /** @type { number } */
        this.user_index_returned = ReturnedComponents.records.findIndex( 
            reservation => reservation.memberID === this.memberID 
        );
        /** @type {!Array<{componentID: String, quantity: number, dateReturned: String}>, ...}>}*/
        this.returned_components = ( this.user_index_returned === -1? [] : this.getReturnedComponents() );
        
        this.handleChangeReturned = this.handleChangeReturned.bind(this);
        this.loadReservations = this.loadReservations.bind(this);
        this.loadReturnedComponentsTable = this.loadReturnedComponentsTable.bind(this);
        this.getReturnedComponents = this.getReturnedComponents.bind(this);
        this.mock_reservations = props.mock_reservations;

        this.state = {
            /** @type { number } */
            returned_user_index: this.user_index_returned,
            /** @type {!Array<{componentID: String, quantity: number, dateReturned: String}>, ...}>}*/
            returnedComponents: this.returned_components
        }
    }

    /*
    *  This function returns the returned components of an specific user based on its index
    */
    getReturnedComponents(){
        return ReturnedComponents.records[this.user_index_returned].returnedComponents;
    }
    
    /*
    *  This function is used to track the change when user clicks in modal button
    */
    handleChangeReturned() {
        if (this.state.returned_user_index === -1) {
            this.user_index_returned = ReturnedComponents.records.findIndex(
                 reservation => reservation.memberID === this.memberID 
            );
        }
        this.returned_components = this.getReturnedComponents();
        this.setState({ returned_user_index: this.user_index_returned, 
            returnedComponents: this.returned_components });
    }

    /*
    *  Loads mock reservations in a table
    */
    loadReservations() {
        if (this.mock_reservations.findIndex((each) =>  each.memberID === this.memberID) !== -1) {
            return(
                <div className="rows-container">
                    <Col>
                        <Row className="first-row justify-content-center">
                            <Col className="justify-content-center">
                                Date
                            </Col>
                            <Col className="justify-content-center">
                                Component
                            </Col>
                            <Col className="justify-content-center">
                                Quantity
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        {
                            this.mock_reservations.map((eachReservation) => {
                            if ( eachReservation.memberID === this.memberID ) {
                                return (
                                    <div key={ eachReservation.reservation_key }>
                                        { eachReservation.reservation.map((eachComponent, index) => {
                                        return (
                                            <div key={ index }>
                                                <Row>
                                                    <Col>{ eachReservation.date }</Col>
                                                    <Col>{ eachComponent.componentID }</Col>
                                                    <Col>{ eachComponent.quantity }</Col>
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
            return ( <h3>You have not done any reservations</h3> );
        }
    }

    /*
    *  Returns the table that contains returned components
    */
   loadReturnedComponentsTable()  {
    if (this.user_index_returned !== -1) {
        return (
            <div className="rows-container">
                <Col>
                    <Row className="first-row justify-content-center">
                        <Col className="justify-content-center">
                            Date
                        </Col>
                        <Col className="justify-content-center">
                            Component
                        </Col>
                        <Col className="justify-content-center">
                            Quantity
                        </Col>
                    </Row>
                </Col>
                <Col>
                    {
                        this.state.returnedComponents.map((component, index) => {
                            return (
                                <div key={ index }>
                                    <Row>
                                        <Col>{ component.dateReturned }</Col>
                                        <Col>{ component.componentID }</Col>
                                        <Col>{ component.quantity }</Col>
                                    </Row>
                                </div>
                            )
                        })
                    }
                </Col>
            </div>
        )
    } else {
        return ( <h3>You have not returned any component</h3> );
    }
}

render() {
        return (
            <div className="profile_container"> 
                <h2 className="blue-title">Your Reservations</h2>
                <Tabs className="tabs-container" defaultActiveKey="reservations">
                    <Tab eventKey="archive" title="Active">
                        <Col className="quit-hor-pads">
                            { this.loadReturnedComponentsTable() }
                        </Col>
                        <Col>
                            <ReturningModal memberID={ this.memberID } 
                            user_index_returned={ this.user_index_returned }
                            handleChangeReturned={ this.handleChangeReturned }/>  
                        </Col>
                    </Tab>
                    <Tab eventKey="reservations" title="History">
                        <Col className="quit-hor-pads">
                            { this.loadReservations() }
                        </Col>
                    </Tab>
                </Tabs>
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
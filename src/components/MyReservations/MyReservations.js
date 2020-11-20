import './MyReservations.css';

import { Col, Row } from 'react-bootstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showReturned, showHistory} from 'scripts/apiScripts.js';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ContactSupportOutlined } from '@material-ui/icons';
import ReturningModal from './ReturningModal/ReturningModal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import $ from "jquery";

class MyReservations extends Component {
    constructor(props) {
        super(props);
        /** @type { String } */
        this.memberID = props.memberID;
        
        
        this.handleChangeReturned = this.handleChangeReturned.bind(this);
        this.loadHistory = this.loadHistory.bind(this);
        this.loadReturned = this.loadReturned.bind(this);
        
        this.state = {
            /** @type {!Array<{id: number, details: {!Array<{component_id: number, component_uuid: String, quantity: number
             * , created_date: String, returned_date: String}}, created_date: String, returned_date: String}>} */
            returnedComponents: [],
            /** @type {!Array<{id: number, details: {!Array<{component_id: number, component_uuid: String, quantity: number
             * , created_date: String, returned_date: String}}, created_date: String, returned_date: String}>} */
            historyComponents: []
        }
    }

    async componentDidMount(){
        const returnedComponents_ = await showReturned();
        const historyComponents_ = await showHistory();
        this.setState({ returnedComponents: returnedComponents_.data, historyComponents: historyComponents_.data });
                        
        $(".collapsible-reservation").on("click",function(){
            let scrollHeight = $(this).next().prop('scrollHeight');
            if($(this).next().css("max-height") === "0px"){
                $(this).next().css("max-height",scrollHeight);
                $(this).find(".angle-icon-up").show();
                $(this).find(".angle-icon-down").hide();
            }else{
                $(this).next().css("max-height",0);
                $(this).find(".angle-icon-up").hide();
                $(this).find(".angle-icon-down").show();
            }
            
        });
        $(".collapsible-reservation").find(".angle-icon-up").hide();
    }
    
    /*
    *  This function is used to track the change when user clicks in modal button
    */
    async handleChangeReturned() {
        const returnedComponents_ = await showReturned();
        const historyComponents_ = await showHistory();
        this.setState({ returnedComponents: returnedComponents_.data, historyComponents: historyComponents_.data });
    }

    /*
    *  Returns the table that contains reservations history
    */
    loadHistory() {
        let keyDetails = 0;
        if (this.state.historyComponents.length !== 0 ) {
            return(
                <div className="rows-container">
                    {
                        this.state.historyComponents.map((reservation) => {
                            return (
                                <>
                                    <Row className="collapsible-reservation">
                                        <Col className="justify-content-center">
                                            Reservation {reservation.id} - {reservation.created_at.substring(0, 10)}
                                        </Col>
                                        <Col className="justify-content-right" sm='1'>
                                            <FontAwesomeIcon icon={ faAngleUp } className='angle-icon-up fa-2x' />
                                            <FontAwesomeIcon icon={ faAngleDown } className='angle-icon-down fa-2x' />
                                        </Col>
                                    </Row>
                                    <div className='reservation-details' key={ reservation.id + "-H" }>
                                        <Row className="first-row justify-content-center">
                                            <Col className="justify-content-center">
                                                Component
                                            </Col>
                                            <Col className="justify-content-center">
                                                Quantity
                                            </Col>
                                            <Col className="justify-content-center">
                                                Status
                                            </Col>
                                            <Col className="justify-content-center">
                                                Returned Date
                                            </Col>
                                        </Row>
                                        { reservation.details.map((component) => {
                                            keyDetails++;
                                            return (
                                                <Row key={ keyDetails+ "-H" }>
                                                <Col>{ component.component_name }</Col>
                                                <Col>{ component.quantity }</Col>
                                                <Col>{ component.status.charAt(0).toUpperCase() + component.status.slice(1) }</Col>
                                                <Col>{ component.returned_date }</Col>
                                            </Row>
                                        )
                                    })}   
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
            )
        } else {
            return ( 
                <div className='rows-container'>
                    <h3>You have not done any reservations</h3>
                </div>
            );
        }
    }

    /*
    *  Returns the table that contains returned components
    */
    loadReturned()  {
        let keyDetails = 0;
        if (this.state.returnedComponents.length !== 0 ) {
            return (
                <div className="rows-container">
                    {
                        this.state.returnedComponents.map((reservation) => {
                            return (
                                <>
                                    <Row className="collapsible-reservation">
                                        <Col className="justify-content-center">
                                            Reservation {reservation.id} - {reservation.created_at.substring(0, 10)}
                                        </Col>
                                        <Col className="justify-content-right" sm='1'>
                                            <FontAwesomeIcon icon={ faAngleUp } className='angle-icon-up fa-2x' />
                                            <FontAwesomeIcon icon={ faAngleDown } className='angle-icon-down fa-2x' />
                                        </Col>
                                    </Row>
                                    <div className='reservation-details' key={ reservation.id + "-R" }>
                                        <Row className="first-row justify-content-center">
                                            <Col className="justify-content-center">
                                                Component
                                            </Col>
                                            <Col className="justify-content-center">
                                                Quantity
                                            </Col>
                                            <Col className="justify-content-center">
                                                Returned Date
                                            </Col>
                                        </Row>
                                        { reservation.details.map((component) => {
                                            keyDetails++;
                                            return (
                                                <Row key={ keyDetails+"-R" }>
                                                <Col>{ component.component_name }</Col>
                                                <Col>{ component.quantity }</Col>
                                                <Col>{ component.returned_date }</Col>
                                            </Row>
                                        )
                                    })}   
                                    </div>
                                </>
                            )
                        })
                    }
                </div>
            )
        } else {
            return ( 
                <div className='rows-container'>
                    <h3>You have not returned any component</h3>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="myReservations-container"> 
                <h2 className="blue-title">My Reservations</h2>
                <Tabs className="tabs-container" defaultActiveKey="archive">
                    <Tab eventKey="archive" title="Returned">
                        <Col className="quit-hor-pads">
                            { this.loadReturned() }
                        </Col>
                        <Col>
                            <ReturningModal
                                activeComponents={ this.state.activeComponents }
                                handleChangeReturned={ this.handleChangeReturned }
                            />
                        </Col>
                    </Tab>
                    <Tab eventKey="reservations" title="History">
                        <Col className="quit-hor-pads">
                            { this.loadHistory() }
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

export default connect(mapStateToProps, null)(MyReservations);
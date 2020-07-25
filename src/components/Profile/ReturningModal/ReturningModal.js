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
            show: false,
            components: this.user_components
        }
    }

    handleIcrement( index ) {
        let check = JSON.parse(localStorage.getItem('components'));
        let temp = this.state.components;
        if(temp[index].quantity < check[index].quantity){
            temp[index].quantity++;
        }
        this.setState({components: temp});
    }

    handleDecrement( index ) {
        let temp = this.state.components;
        if (temp[index].quantity > 0){
            temp[index].quantity--;
        }
        this.setState({components: temp});
    }

    handleShow() {
        let check = ActiveComponents.reservations[this.usr_index].activeComponents;
        localStorage.setItem('components', JSON.stringify(check));
        this.setState({ show: true })
    }
    
    handleClose() {
        let check = JSON.parse(localStorage.getItem('components'));
        ActiveComponents.reservations[this.usr_index].activeComponents = check;
        this.setState({components: check});
        this.setState({ show: false })
    }

    loadReserved() {
        let componentsList = [];
        for (let i = 0; i < this.state.components.length; i++) {
            componentsList.push(
                <Row className='sin_comp_backg_r container bottom-buffer'>
                        <Col xs='6' className='container pd-5'>
                            <Col className='container'>{this.state.components[i].componentID}</Col>
                        </Col>
                        <Col xs='6' className='container'>
                            <Col xs='2' className='col-pd hor-center align-items-center container'>
                                <Button className='subt-button' onClick={() => this.handleDecrement(i)}>-</Button>
                            </Col>
                            <Col xs='4' className='item-counter col-pd ver-center hor-center container'>
                                <div className="input-group-field">
                                    {this.state.components[i].quantity}
                                </div>
                            </Col>
                            <Col xs='2' className='col-pd hor-center align-items-center container'>
                                <Button className='add-button' onClick={() => this.handleIcrement(i)}>+</Button>
                            </Col>
                            <Col xs='4' className='col-pd hor-center align-items-center container'>
                                <Checkbox className='checkbox' />
                            </Col>
                        </Col>
                </Row>
            );
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
                <Row className="headers justify-content-center container bottom-buffer">
                        <Col xs='6' className="align-left container pd-5">
                            <h5>Component</h5>
                        </Col>
                        <Col xs='6' className="align-left container pd-5">
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
                        <Row className="justify-content-center container">
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
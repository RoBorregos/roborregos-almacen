import './SelectionCart.css';

import { Button, Col, Row } from 'react-bootstrap';
import React, { Component } from 'react';
import { addQuantity, clearCart, removeItem, subtractQuantity, types } from '../../scripts/cartReducer';
import { faMinus, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

import ActiveComponents from '../../data/active_components.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MockReservation from '../../data/mock_reservations.json';
import QrCode from '../QrCode/QrCode.js';
import { connect } from 'react-redux';
import placeholder from 'images/placeholder-rectangle.png';

class SelectionCart extends Component {

    constructor(props) {
        super(props);

        this.getItems = this.getItems.bind(this);
        this.tryRequire = this.tryRequire.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.doAPICall = this.doAPICall.bind(this);
        this.handleClose = this.props.handleClose;
        this.components = props.components;
        this.userID = props.userID;

        this.state = {
            handleChange: false,
            showQR: false,
            idQR: '',
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return (nextProps.addedItems !== this.props.addedItems)
    }

    tryRequire(section, img_path) {
        try {
            return require('images/' + section + '/' + img_path);
        } catch (err) {
            return placeholder;
        }
    }

    getCurrentDate() {
        const today = new Date();
        const dd = today.getDate();
        let mm= today.getMonth()+1;
        mm = mm < 9 ? '0' + mm : mm;  
        const yyyy = today.getFullYear();
        return dd + '-' + mm + '-' + yyyy;
    }

    doAPICall(addedItems) {
        const data = {
            'reservation_key': Math.floor( Math.random() * 100 ), 
            'memberID': this.userID, 
            'date': this.getCurrentDate(),
            'reservation': [
            ]
        };
        const reservedComponents = {
            'memberID': this.userID,
            'activeComponents': [
            ]
        };
        for (let id in addedItems) {
            if(addedItems[id].quantity === 0) continue;
            data.reservation.push({
                'componentID' : id,
                'quantity' : addedItems[id].quantity,
            })
            reservedComponents.activeComponents.push({
                'componentID' : id,
                'quantity' : addedItems[id].quantity,
            })
        }
        MockReservation.reservations.push(data);
        const reserveIndex = ActiveComponents.reservations.findIndex(item => item.memberID === this.userID);
        if (reserveIndex >= 0 ) {
            reservedComponents.activeComponents.forEach(e => {
                    ActiveComponents.reservations[reserveIndex].activeComponents.push(e);
            })
        }
        else {
            ActiveComponents.reservations.push(reservedComponents);  
        }
    }

    handleAction(action, component) {
        switch (action) {
            case types.ADD_QUANTITY:
                this.props.addQuantity(component);
                break;
            case types.SUB_QUANTITY:
                this.props.subtractQuantity(component);
                break;
            case types.REMOVE_COMPONENT:
                this.props.removeItem(component);
                break;
            case types.CLEAR_CART:
                this.doAPICall(this.props.addedItems);
                this.props.clearCart();
                this.setState({ showQR: true, idQR: 'Hola Mundo.' })
                return;
            default:
                break;
        }
        this.setState({ handleChange: !this.state.handleChange });
    }


    getItems() {
        if (typeof this.props.addedItems === undefined)
            return;

        let res = [];
        let section_ = null;
        for (let component in this.props.addedItems) {
            console.log(this.props.addedItems)
            var componente = null;
            const categorieComponents = this.props.components[this.props.addedItems[component].section];
            for(var key in categorieComponents){
                if (categorieComponents[key].id === component) 
                    componente = categorieComponents[key];
            }
            section_ = this.props.addedItems[component].section;
            if (!this.props.components.hasOwnProperty(section_)) {
                continue;
            }
            res.push(
                <Row key={ component } className='sin_comp_backg_r'>
                    <Col xs='2' className='ver-center resp'>
                        <div className='sin_comp_backg_sc hor-center'>
                            <img className='component-img' alt={ component } src={ /*this.tryRequire(section_, componente.img_path)*/ componente.img_path } />
                        </div>
                    </Col>
                    <Col xs='6' className={'col-pd ver-center resp' + (this.props.addedItems[component].quantity > 0? ' orange-letters' : '')}>
                        { componente.name }
                    </Col>
                    <Col xs='3' className='col-pd ver-center justify-content-center'>
                        <Row className='resp-just ver-center'>
                            <Col xs={ 3 } className='col-pd hor-center ver-center'>
                                <FontAwesomeIcon icon={ faMinus } className='operation-btn'
                                style={{ color: (this.props.addedItems[component].quantity > 0? '#33e1ff' : '#2d2d2d') }} 
                                onClick={ () => this.handleAction(types.SUB_QUANTITY, component) }></FontAwesomeIcon>
                            </Col>
                            <Col xs={ 3 } className='item-counter col-pd ver-center hor-center'>
                                { this.props.addedItems[component].quantity } 
                            </Col>
                            <Col xs={ 3 } className='col-pd hor-center ver-center'>
                                <FontAwesomeIcon icon={ faPlus } className='operation-btn'
                                style={{ color: (this.props.addedItems[component].quantity < componente.stock? '#fd7e14' : '#2d2d2d') }}
                                onClick={ () => this.handleAction(types.ADD_QUANTITY, component) }></FontAwesomeIcon>
                            </Col>
                            <Col xs={ 3 } className='col-pd hor-center ver-center'>
                                <FontAwesomeIcon icon={ faTimes } className='operation-btn'
                                style={{ color: 'red'}}
                                onClick={ () => this.handleAction(types.REMOVE_COMPONENT, component) }></FontAwesomeIcon>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            );
        }
        return res;
    }

    render() {
        if (this.state.showQR) {
            return (
                <Col className='qrcode-container'>
                    <Row className='justify-content-center mb-4'>
                        Save your QRcode!!
                    </Row>
                    <Row className='justify-content-center'>
                        <QrCode idQR={ this.state.idQR } />
                    </Row>
                </Col>
            );
        }
        else if(Object.keys(this.props.addedItems).length === 0) {
            return (
                <Col className='cart-container'>
                    <Row className='cart-header empty-title'>
                        Your cart is empty!
                    </Row>
                    <Row className='justify-content-center'>
                        <Button className='checkout-button'
                            disabled={ (Object.keys(this.props.addedItems).length === 0) }
                            onClick={ () => { this.handleAction(types.CLEAR_CART) } }>
                            Reserve
                        </Button>
                    </Row>
                </Col>
            );
        } else {
            return (
                <Col className='cart-container'>
                    
                    <Row className='cart-collection justify-content-center'>
                        <Row style={{ width: '100%' }}>
                            <Col xs={ 8 }>
                                <h4 style={{ paddingLeft: '7px' }}>Component</h4>
                            </Col>
                            <Col xs={ 3 } style={{ paddingLeft: '0px', marginLeft: '-2px' }}>
                                <h4>Quantity</h4>
                            </Col>
                        </Row>
                        { this.getItems() }
                    </Row>
                    <Row className='justify-content-center'>
                        <Button className='checkout-button'
                            disabled={ (Object.keys(this.props.addedItems).length === 0) }
                            onClick={ () => { this.handleAction(types.CLEAR_CART) } }>
                            Reserve
                        </Button>
                    </Row>
                </Col>
            );
        }
    }
}


const mapStateToProps = (state) => {
    return {
        components: state.components,
        addedItems: state.addedItems
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        subtractQuantity: (id) => { dispatch(subtractQuantity(id)) },
        addQuantity: (id) => { dispatch(addQuantity(id)) },
        removeItem: (id) => { dispatch(removeItem(id)) },
        clearCart: () => { dispatch(clearCart()) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionCart);
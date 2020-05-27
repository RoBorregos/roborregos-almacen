import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import './SelectionCart.css';
import placeholder from 'images/placeholder-rectangle.png';
import { connect } from 'react-redux';
import Qr_code from '../QR_code/QR_code.js';
import MockReservation from '../../data/mock_reservations.json';
import { types, subtractQuantity, addQuantity, removeItem, clearCart } from '../../scripts/cartReducer';

class SelectionCart extends Component {

    constructor(props) {
        super(props);

        this.getItems = this.getItems.bind(this);
        this.tryRequire = this.tryRequire.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.doAPICall = this.doAPICall.bind(this);
        this.handleClose = this.props.handleClose;
        this.components = props.components;
        this.userID= this.props.userID;

        this.state = {
            handleChange: false,
            showQR: false,
            idQR: '',
        }
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
        let data = {
            'reservation_key': Math.floor( Math.random() * 100 ), 
            'member_ID': this.userID, 
            'date': this.getCurrentDate(),
            'reservation': [
            ]
        };
        for(let id in addedItems) {
            data.reservation.push({
                'componentID' : id,
                'quantity' : addedItems[id].quantity,
            })
        }
        MockReservation.reservations.push(data);
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
        let item = null, section_ = null;
        for (let component in this.props.addedItems) {
            section_ = this.props.addedItems[component].section;
            if (!this.props.components.hasOwnProperty(section_)) {
                continue;
            }
            item = this.props.components[section_][component];
            if (typeof item === 'undefined') {
                continue;
            }
            res.push(
                <Row key={component} className='justify-content-center'>
                    <Col xs='3'>
                        <img className='component-img' alt={component} src={ this.tryRequire(section_, item.img_path) } />
                    </Col>
                    <Col xs='5'>
                        { item.name }
                    </Col>
                    <Col xs='4'>
                        <Row>
                            <Col xs='2'>
                                <button onClick={ () => this.handleAction(types.SUB_QUANTITY, component) }>-</button>
                            </Col>
                            <Col xs='4'>
                                { this.props.addedItems[component].quantity }
                            </Col>
                            <Col xs='2'>
                                <button onClick={ () => this.handleAction(types.ADD_QUANTITY, component) }>+</button>
                            </Col>
                            <Col xs='2'>
                                <button onClick={ () => this.handleAction(types.REMOVE_COMPONENT, component) }>x</button>
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
                        <Qr_code idQR={ this.state.idQR } />
                    </Row>
                </Col>
            );
        } 
        else {
            return (
                <Col className='cart-container'>
                    <Row className='cart-header'>
                        { (Object.keys(this.props.addedItems).length === 0) ? "Your cart is empty!" : "" }
                    </Row>
                    <Col className='cart-collection'>
                        { this.getItems() }
                    </Col>
                    <Row className='justify-content-center'>
                        <button
                            disabled={ Object.keys(this.props.addedItems).length === 0 }
                            onClick={ () => { this.handleAction(types.CLEAR_CART) } }>
                            Checkout
                        </button>
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
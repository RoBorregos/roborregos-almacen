import './SingleComponentModal.css';

import { Button, Col, Row } from 'react-bootstrap';
import React, { Component } from 'react';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addToCart } from './../../../../../scripts/cartReducer';
import { connect } from 'react-redux';
import placeholder from 'images/placeholder-rectangle.png';

class SingleComponentModal extends Component {
    constructor(props) {
        super(props);

        this.tryRequire = this.tryRequire.bind(this);
        this.handleIncrement = this.handleIncrement.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getAlreadyInCart = this.getAlreadyInCart.bind(this);
        this.handleClose = props.handleClose;
        this.component = props.component;
        this.section = props.section;
        this.componentKey = this.props.componentKey;
        this.stock = this.component.stock;

        this.state = {
            quantity: 0,
            reserveButtonState: 0
        }
    }

    tryRequire(img_path) {
        try {
            return img_path;
        } catch (err) {
            return placeholder;
        }
      }

    handleIncrement() {
        if (this.state.quantity === this.component.stock - this.getAlreadyInCart()) return;

        this.setState({ quantity: this.state.quantity + 1 })
    }

    handleDecrement() {
        if (this.state.quantity <= 0) return;
        this.setState({ quantity: this.state.quantity - 1 })
    }

    handleChange() {
        this.props.addToCart(this.key, this.component.id, this.state.quantity, this.section);
        this.handleClose();
    }

    reserveDisabledButton() {
        return this.state.quantity === 0;
    }

    getAlreadyInCart() {
        if (this.props.addedItems) {
            if (this.props.addedItems.hasOwnProperty(this.component.id)) {
                return this.props.addedItems[this.component.id].quantity;
            }
        }
        return 0;
    }

    render() {
        return (
            <div className="singleComponentModal_container" onClick={ e => e.stopPropagation() }>
                <Row className="justify-content-sm-center ">
                    <Col sm='6' className='img-col'>
                        <img
                            className="single_component_image"
                            src={ this.tryRequire(this.component.img_path) }
                            alt={ this.component.id }
                        />
                    </Col>
                    <Col sm='6'>
                        <div className="component_data justify-content-center">
                            <p>In Stock: { this.component.stock }</p>
                            <p>
                                Already in Cart : { this.getAlreadyInCart() }
                            </p>
                            <Row>
                                <Col xs={ 6 } style={{ marginLeft: "5px" }}>
                                    <Row className='resp-just ver-center'>
                                        <Col xs={ 3 } className='col-pd hor-center ver-center'>
                                            <FontAwesomeIcon icon={ faMinus } className='operation-btn' onClick={ this.handleDecrement }
                                            style={{ color: (this.state.quantity > 0? '#33e1ff' : '#2d2d2d') }} 
                                            ></FontAwesomeIcon>
                                        </Col>
                                        <Col xs={ 3 } className='item-counter col-pd ver-center hor-center'>
                                            { this.state.quantity }
                                        </Col>
                                        <Col xs={ 3 } className='col-pd hor-center ver-center'>
                                            <FontAwesomeIcon icon={ faPlus } className='operation-btn' onClick={ this.handleIncrement }
                                            style={{ color: (
                                                this.state.quantity < this.component.stock - this.getAlreadyInCart()? '#fd7e14' : '#2d2d2d') }}
                                            ></FontAwesomeIcon>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Button
                        className="checkout-button add-button"
                        onClick={ this.handleChange }
                        disabled={ this.reserveDisabledButton() } >
                        Agregar al Carrito
                    </Button>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addedItems: state.addedItems
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addToCart: (key, id, quantity, section) => { dispatch(addToCart(key, id, quantity, section)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleComponentModal);
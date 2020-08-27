import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import placeholder from 'images/placeholder-rectangle.png';
import './SingleComponentModal.css';
import { connect } from 'react-redux';
import { addToCart } from './../../../../../scripts/cartReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

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

        this.stock = this.component.stock;

        this.state = {
            quantity: 0,
            reserveButtonState: 0
        }
    }

    tryRequire(img_path) {
        try {
            return require('images/' + this.section + '/' + img_path);
        } catch (err) {
            return placeholder;
        }
    }

    handleIncrement() {
        let quantityInCart = 0;

        if (this.props.addedItems) {
            if (this.props.addedItems.hasOwnProperty(this.component.id)) {
                quantityInCart = this.props.addedItems[this.component.id].quantity;
            }
        }

        if (this.state.quantity === this.component.stock - quantityInCart) return;

        this.setState({ quantity: this.state.quantity + 1 })
    }

    handleDecrement() {
        if (this.state.quantity <= 0) return;
        this.setState({ quantity: this.state.quantity - 1 })
    }

    handleChange() {
        this.props.addToCart(this.component.id, this.state.quantity, this.section);
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
                    <Col sm='6'>
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
                            <div className="inline_section d-flex justify-content-center">
                                <Button 
                                    className='minus_button' 
                                    onClick={this.handleDecrement }>
                                    <FontAwesomeIcon icon={faMinus} className='mr-2' />
                                </Button>
                                <div className="input-group-field" > { this.state.quantity }</div>
                                <Button
                                    className="plus_button"
                                    onClick={ this.handleIncrement }> 
                                    <FontAwesomeIcon icon={faPlus} className='mr-2' />
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Button
                        className="reserve_button"
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
        addToCart: (id, quantity, section) => { dispatch(addToCart(id, quantity, section)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleComponentModal);
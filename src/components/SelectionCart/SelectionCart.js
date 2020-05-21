import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import './SelectionCart.css';
import placeholder from 'images/placeholder-rectangle.png';
import { connect } from 'react-redux';
import { types, subtractQuantity, addQuantity, removeItem, clearCart } from '../../scripts/cartReducer';

class SelectionCart extends Component {

    constructor(props) {
        super(props);
        this.getItems = this.getItems.bind(this);
        this.tryRequire = this.tryRequire.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.components = props.components;

        this.state = {
            verifyChange: false,
        }
    }

    tryRequire(section, img_path) {
        try {
            return require('images/' + section + '/' + img_path);
        } catch (err) {
            return placeholder;
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
            default:
                break;
        }
        this.setState({ verifyChange: !this.state.verifyChange });
    }


    getItems() {
        if (!this.props.addedItems)
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
                        <img className='component-img' alt={item.name} src={this.tryRequire(section_, item.img_path)} />
                    </Col>
                    <Col xs='5'>
                        {item.name}
                    </Col>
                    <Col xs='4'>
                        <Row>
                            <Col xs='2'>
                                <button onClick={() => this.handleAction(types.SUB_QUANTITY, component)}>-</button>
                            </Col>
                            <Col xs='4'>
                                {this.props.addedItems[component].quantity}
                            </Col>
                            <Col xs='2'>
                                <button onClick={() => this.handleAction(types.ADD_QUANTITY, component)}>+</button>
                            </Col>
                            <Col xs='2'>
                                <button onClick={() => this.handleAction(types.REMOVE_COMPONENT, component)}>x</button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            );
        }
        return res;
    }

    render() {
        return (
            <Col className='cart-container'>
                <Row className='cart-header'>
                    Checkout!
                </Row>
                <Col className='cart-collection'>
                    {this.getItems()}
                </Col>
                <Row className='justify-content-center'>
                    <button
                        onClick={this.props.clearCart}>
                        DONE
                    </button>
                </Row>
            </Col>
        );
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
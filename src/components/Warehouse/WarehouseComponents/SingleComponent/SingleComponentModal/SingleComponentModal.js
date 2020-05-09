import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import placeholder from 'images/placeholder-rectangle.png';
import './SingleComponentModal.css';

class SingleComponentModal extends Component {
    constructor(props) {
        super(props);

        this.tryRequire = this.tryRequire.bind(this);
        this.handleIncrement = this.handleIncrement.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);

        this.component = props.component;
        this.section = props.section;
        this.stock = this.component.stock;

        this.state = {
            count: 1
        }

    }

    tryRequire(img_path) {
        try {
            return require('images/' + this.section + '/' + img_path);
        } catch (err) {
            return placeholder;
        }
    }

    handleIncrement(){
        if(this.state.count == this.component.stock) return;

        this.setState({ count: this.state.count + 1 })
    }

    handleDecrement(){
        if(this.state.count == 1) return;

        this.setState({ count: this.state.count - 1 })
    }

    render() {
        return(
            <div className = "singleComponentModal_container" onClick={e => e.stopPropagation()}>
                <Row className = "justify-content-sm-center ">
                    <Col sm = '6'>
                        <img
                            className = "single_component_image"
                            src={ this.tryRequire(this.component.img_path) }
                            alt={ this.component.id }
                        />
                    </Col>
                    <Col sm = '6'>
                        <div className = "component_data justify-content-center">
                            <p>In Stock: { this.component.stock }</p>
                            <p>How many you want to reserve?  </p>
                            <div className = "inline_section d-flex justify-content-center">
                                <Button 
                                    className = "minus_button" 
                                    onClick = { this.handleDecrement}> - 
                                </Button>
                                <div className="input-group-field" > { this.state.count }</div>
                                <Button 
                                    className = "plus_button" 
                                    onClick = { this.handleIncrement }> + 
                                </Button>
                            </div>
                        </div>
                    </Col>
                    <Button className = "reserve_button">Reserve</Button>
                </Row>
            </div>
        );
    }
}
export default SingleComponentModal;
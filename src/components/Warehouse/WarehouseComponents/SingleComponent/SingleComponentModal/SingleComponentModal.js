import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import placeholder from 'images/placeholder-rectangle.png';

class SingleComponentModal extends Component{
    constructor(props){
        super(props);

        this.tryRequire = this.tryRequire.bind(this);

        this.component = props.component;
        this.section = props.section;
    }

    tryRequire(img_path) {
        try {
            return require('images/' + this.section + '/' + img_path);
        } catch (err) {
            return placeholder;
        }
    }

    render(){
        return(
            <div className = "singleComponentModal_container">
                <Row className = "justify-content-sm-center ">
                    <Col sm = '6'>
                        <img
                            className = "single_component_image"
                            src={ this.tryRequire(this.component.img_path) }
                            alt={ this.component.id }
                        />
                    </Col>
                    <Col sm = '6'>
                        <div className = "component_data">
                            <p>In Stock: { this.component.stock }</p>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default SingleComponentModal;
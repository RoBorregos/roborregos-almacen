import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SingleComponent from './SingleComponent/SingleComponent.js';

class WarehouseComponents extends Component {
    constructor(props) {
        super(props);    

        this.components = props.components;
    }
    render() {
        return(
            <div className= "WareHouseComponent_container">
                <Container fluid = "md">
                    <Col lg= { true }>
                        <Row className= 'justify-content-sm-left' >
                            { this.components.map((component,index) => (
                                <Col sm='4' md='2' key={ index } className='component-col'>
                                    <SingleComponent
                                    component =  { component }
                                    />
                                </Col>
                            )) }
                        </Row>
                    </Col>
                </Container>
            </div>
        );
    }
}
export default WarehouseComponents;
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
                <Container>
                    <Row>
                        { this.components.map((component,index) => (
                            <Col>
                                <SingleComponent
                                key = { index }
                                component =  { component }
                                />
                            </Col>
                        )) }
                    </Row>
                </Container>

            </div>
        );
    }
}
export default WarehouseComponents;
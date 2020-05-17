import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import './WarehouseHeader.css';

class WarehouseHeader extends Component{
    render() {
        return(
            <Col className = "warehouse-header ">
                <Row className= 'justify-content-center'>
                    <p> Welcome to RoBorrego's Warehouse</p>
                </Row>
            </Col>
        ); 
    }
}

export default WarehouseHeader;
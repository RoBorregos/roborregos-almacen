import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import './WarehouseHeader.css';

class WarehouseHeader extends Component{
    render() {
        return(
            <div className = "warehouse-header ">
                <Row className= 'justify-content-sm-center'>
                    <p> Welcome to RoBorrego's Warehouse</p>
                </Row>
            </div>
        ); 
    }
}

export default WarehouseHeader;
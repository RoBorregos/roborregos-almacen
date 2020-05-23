import React, { Component } from 'react';
import WarehouseComponents from './WarehouseComponents/WarehouseComponents.js';
import WarehouseHeader from './WarehouseHeader/WarehouseHeader.js';
import Footer from 'components/Footer/Footer.js';
import './Warehouse.css';

class Warehouse extends Component { 
    render() {
        return(
            <div className = "warehouse_contanier">
                <WarehouseHeader />
                <WarehouseComponents />
                <Footer />
            </div>
        );
    }
}
export default Warehouse;

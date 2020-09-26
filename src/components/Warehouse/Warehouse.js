import React, { Component } from 'react';
import WarehouseComponents from './WarehouseComponents/WarehouseComponents.js';
import WarehouseHeader from './WarehouseHeader/WarehouseHeader.js';
import './Warehouse.css';
import { getMemberInfo } from './../../scripts/apiScripts.js';

class Warehouse extends Component { 
    
    async tryAPI(){
        console.log(await getMemberInfo('cisne00'));
    }
    render() {
        setTimeout(() => {
            this.tryAPI();
        }, 1000);

        return(
            <div className = "warehouse_contanier">
                <WarehouseHeader />
                <WarehouseComponents />
            </div>
        );
    }
}
export default Warehouse;

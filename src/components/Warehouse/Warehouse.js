import React, { Component } from 'react';
import WarehouseComponents from './WarehouseComponents/WarehouseComponents.js';
import WarehouseHeader from './WarehouseHeader/WarehouseHeader.js';
import { loadComponents } from '../../scripts/cartReducer';
import { getComponents } from 'scripts/apiScripts.js';
import { connect } from 'react-redux';
import './Warehouse.css';

class Warehouse extends Component {

    async componentDidMount(){
        if(Object.entries(this.props.components).length === 0){
            const components = await getComponents();
            this.props.loadComponents(components.data);
        }
    }
    
    render() {
        return(
            <div className = "warehouse_contanier">
                <WarehouseHeader />
                <WarehouseComponents />
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        components: state.components
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        loadComponents: (components) => { dispatch(loadComponents(components)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Warehouse);

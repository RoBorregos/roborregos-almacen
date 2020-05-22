import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import SingleComponent from './SingleComponent/SingleComponent.js';
import { connect } from 'react-redux';
import './WarehouseComponents.css';

class WarehouseComponents extends Component {
    constructor(props) {
        super(props);

        this.resolveFilter = this.resolveFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: 'All'
        }
    }

    resolveFilter(section) {
        let componentsList=[];
        if (section === "All") {
            for(let section_ in this.props.components){
                for(let id in this.props.components[section_]){
                    this.props.components[section_][id]["id"]=id;
                    componentsList.push(
                        <Col xs='12'  sm='6' md='4' lg='3' key={ id } className='component-col'>
                            <SingleComponent
                                component={ this.props.components[section_][id] }
                                section={ section_ }
                            />
                        </Col>   
                    );
                }
            }
        }
        else {
            if(!this.props.components.hasOwnProperty(section)){
                return componentsList;
            }
            for(let id in this.props.components[section]){
                this.props.components[section][id]["id"]=id;
                componentsList.push(
                    <Col xs='12'  sm='6' md='4' lg='3' key={ id } className='component-col'>
                        <SingleComponent
                            component={ this.props.components[section][id] }
                            section={ section }
                        />
                    </Col>  
                );
            }
        }
        return componentsList;
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    render() {
        return (
            <Row className='justify-content-center mr-0 ml-0'>
                <Col xs='10' sm='10' md='10' lg='10' xl='10'>
                    <Row className='warehousecomponent-search'>
                        <span className='warehousecomponent-search-title'>Filter by component type:</span>
                        <select className="search_filter" onChange={ this.handleChange } value={ this.state.value }>
                            <option value="All"> All </option>
                            <option value="component"> Circuit Component </option>
                            <option value="sensors"> Sensors </option>
                            <option value="motors"> Motors </option>
                            <option value="microcontrollers"> Microcontrollers </option>
                        </select>
                    </Row>
                    <Row>
                        { this.resolveFilter(this.state.value) }
                    </Row>
                </Col>
            </Row>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        components: state.components
    }
}
export default connect(mapStateToProps,null)(WarehouseComponents);
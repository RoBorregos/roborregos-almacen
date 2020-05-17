import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SingleComponent from './SingleComponent/SingleComponent.js';
import './WarehouseComponents.css';

class WarehouseComponents extends Component {
    constructor(props) {
        super(props);

        this.components = props.components;

        this.resolveFilter = this.resolveFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: 'All'
        }
    }

    resolveFilter(section) {
        let values = ["component", "sensors", "motors", "microcontrollers"];
        if (section === "All") {
            return (
                values.map((element, index) => (
                    this.components[element].map((component, i) => (
                        <Col xs='12'  sm='6' md='4' lg='4' key={i} className='component-col'>
                            <SingleComponent
                                component={component}
                                section={element}
                            />
                        </Col>
                    ))
                ))
            );
        }
        else {
            return (
                this.components[section].map((component, i) => (
                    <Col xs='6'  sm='4' md='3' lg='3' key={i} className='component-col'>
                        <SingleComponent
                            component={component}
                            section={section}
                        />
                    </Col>
                ))
            );
        }
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
                        <select className="search_filter" onChange={this.handleChange} value={this.state.value}>
                            <option value="All"> All </option>
                            <option value="component"> Circuit Component </option>
                            <option value="sensors"> Sensors </option>
                            <option value="motors"> Motors </option>
                            <option value="microcontrollers"> Microcontrollers </option>
                        </select>
                    </Row>
                    <Row>
                        {this.resolveFilter(this.state.value)}
                    </Row>
                </Col>
            </Row>
        );
    }
}
export default WarehouseComponents;
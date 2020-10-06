import './WarehouseComponents.css';

import { Col, Row } from 'react-bootstrap';
import React, { Component } from 'react';
import { faSearch, faSort } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SingleComponent from './SingleComponent/SingleComponent.js';
import { connect } from 'react-redux';

class WarehouseComponents extends Component {
    constructor(props) {
        super(props);

        this.resolveFilter = this.resolveFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleComponentSearch = this.handleComponentSearch.bind(this);

        this.state = {
            value: 'All',
            searchedComponentValue: ''
        }
    }

    resolveFilter(section) {

        let componentsList = [];
        let searchedComponent = this.state.searchedComponentValue.toLowerCase();
        if (section === "All") {
            if (this.state.searchedComponentValue !== '') {
                for (let section_ in this.props.components) {
                    for (let id in this.props.components[section_]) {

                        let componentName = this.props.components[section_][id]["name"].toLowerCase();
                        if (componentName.indexOf(searchedComponent) > -1) {
                            componentsList.push(
                                <Col xs={ 12 } sm={ 6 } md={ 4 } lg= { 3 } key={ id } className='component-col'>
                                    <SingleComponent
                                        component={ this.props.components[section_][id] }
                                        section={ section_ }
                                    />
                                </Col>
                            );
                        }
                    }
                }
            }
            else {
                for (let section_ in this.props.components) {
                    for (let id in this.props.components[section_]) {
                        this.props.components[section_][id]["id"] = id;
                        componentsList.push(
                            <Col xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 } key={ id } className='component-col'>
                                <SingleComponent
                                    component={ this.props.components[section_][id] }
                                    section={ section_ }
                                />
                            </Col>
                        );
                    }
                }
            }
        }
        else {
            if (!this.props.components.hasOwnProperty(section)) {
                return componentsList;
            }

            if (this.state.searchedComponentValue !== '') {
                for (let id in this.props.components[section]) {

                    this.props.components[section][id]["id"] = id;
                    let componentName = this.props.components[section][id]["name"].toLowerCase();
                    if (componentName.indexOf(searchedComponent) > -1) {
                        componentsList.push(
                            <Col xs='12' sm='6' md='4' lg='3' key={id} className='component-col'>
                                <SingleComponent
                                    component={ this.props.components[section][id] }
                                    section={ section }
                                />
                            </Col>
                        );
                    }
                }
            }
            else {
                for (let id in this.props.components[section]) {
                    this.props.components[section][id]["id"] = id;
                    componentsList.push(
                        <Col xs='12' sm='6' md='4' lg='3' key={ id } className='component-col'>
                            <SingleComponent
                                component={ this.props.components[section][id] }
                                section={ section }
                            />
                        </Col>
                    );
                }
            }
        }
        return componentsList;
    }

    handleComponentSearch(e) {
        this.setState({ searchedComponentValue: e.target.value })
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    render() {
        return (
            <Row className='justify-content-center mr-0 ml-0' style={{ display: 'inline-flex' }}>
                <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                    <Row className='warehousecomponent-search' >
                        <Col>
                            <div>
                                <FontAwesomeIcon icon={faSort} className='warehousecomponent-sortandsearch-icons' />
                                <select className="search_filter" onChange={ this.handleChange } value={ this.state.value }>
                                    <option value="All"> All </option>
                                    <option value="component"> Circuit Component </option>
                                    <option value="sensors"> Sensors </option>
                                    <option value="motors"> Motors </option>
                                    <option value="microcontrollers"> Microcontrollers </option>
                                </select>
                            </div>
                        </Col>
                        <Col>
                            <div className='warehousecomponent-searchbox'>
                                <FontAwesomeIcon icon={faSearch} className='warehousecomponent-sortandsearch-icons' />
                            <input
                                className="component_search_filter"
                                type="search"
                                placeholder="Search component"
                                value={ this.state.searchedComponentValue }
                                onChange={ this.handleComponentSearch }>
                            </input>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        { this.resolveFilter(this.state.value) }
                    </Row>
                </Col>
            </Row>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        components: state.components
    }
}
export default connect(mapStateToProps, null)(WarehouseComponents);
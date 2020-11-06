import './WarehouseComponents.css';

import { Col, Row } from 'react-bootstrap';
import React, { Component } from 'react';
import { faSearch, faSort } from '@fortawesome/free-solid-svg-icons';
import { loadComponents } from '../../../scripts/cartReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SingleComponent from './SingleComponent/SingleComponent';
import { connect } from 'react-redux';
import { getCategories, getComponentsSuffix } from 'scripts/apiScripts';

class WarehouseComponents extends Component {
    constructor(props) {
        super(props);
        this.resolveFilter = this.resolveFilter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleComponentSearch = this.handleComponentSearch.bind(this);
        this.getOptions = this.getOptions.bind(this);

        this.state = {
            value: 'All',
            searchedComponentValue: '',
            categories: []
        }
    }

    async componentDidMount() {
        const categories = await getCategories();
        const categoriesNamed = []
        categories.data.forEach(element => {
            categoriesNamed.push(element.name)
        });
        this.setState({ categories: categoriesNamed })
    }

    async shouldComponentUpdate(nextProps, nextState) {
        if(nextState.searchedComponentValue !== this.state.searchedComponentValue) return;
        const components = await getComponentsSuffix(this.state.searchedComponentValue);
        this.props.loadComponents(components.data);
    }

    getOptions(){
        const arrayOfCategories = []
        arrayOfCategories.push( <option value="All"> All </option> )
        for(let index = 0; index < this.state.categories.length; index++){
            arrayOfCategories.push(
                <option value={this.state.categories[index]}> {this.state.categories[index]} </option>
            )
        }
        return (
            <select className="search_filter" onChange={ this.handleChange } value={ this.state.value }>
                { arrayOfCategories }
            </select>
        )
    }

    resolveFilter(section) {
        const componentsList = [];
        if (section === "All") {
            for (let section_ in this.props.components) {
                for (let id in this.props.components[section_]) {
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
        } else {
            if (!this.props.components.hasOwnProperty(section)) {
                return componentsList;
            }
            for (let id in this.props.components[section]) {
                this.props.components[section][id]["id"] = id;
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
            <Row className='warehouse-component-container'>
                <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                    <Row className='warehousecomponent-search' >
                        <Col>
                            <div>
                                <FontAwesomeIcon icon={faSort} className='warehousecomponent-sortandsearch-icons' />
                                { this.getOptions() }
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
const mapDispatchToProps = (dispatch) => {
    return {
        loadComponents: (components) => { dispatch(loadComponents(components)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseComponents);
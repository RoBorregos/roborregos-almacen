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
        let values = ["All","Circuit Component","Sensors","Motors","Microcontrollers"];
        if(section == "All") {
            return(this.components.map((component,index) => (
                <Col sm='4' md='3' key={ index } className='component-col'>
                    <SingleComponent
                    component =  { component }
                    />
                </Col>
            )));
        }
        else{
            return(
                <h1>Hello World</h1>
            );
        }
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    render() {
        
        return(
            <div className= "WareHouseComponent_container">
                <Container fluid = "md">
                    <Col lg= { true }>
                        <label className = "search_filter_label" htmlFor = "search_filter">Filter by component type: </label>
                        <select className= "search_filter" onChange = { this.handleChange } > 
                            <option value = "All">All</option>
                            <option value = "Circuit Component">Circuit Component</option>
                            <option value = "Sensors">Sensors</option>
                            <option value = "Motors">Motors</option>
                            <option value = "Microcontrollers">Microcontrollers</option>
                        </select>
                        <br/>
                        <br/>
                            <Row className= 'justify-content-sm-center' >
                                { this.resolveFilter(this.state.value) }
                            </Row>
                    </Col>
                </Container>
            </div>
        );
    }
}
export default WarehouseComponents;
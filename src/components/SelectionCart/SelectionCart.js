import React, { Component } from 'react';
import './SelectionCart.css';

class SelectionCart extends Component{

    constructor(props) {
        super(props);
    
        this.components = props.components;
    }

    render() {
        return(
            <div>
                <ul>Component 1</ul>
                <ul>Component 2</ul>
                <ul>Component 3</ul>
                <ul>Component 4</ul>
            </div>
        );
    }
}
export default SelectionCart;
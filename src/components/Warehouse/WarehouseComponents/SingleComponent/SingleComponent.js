import React, { Component } from 'react';

class SingleComponent extends Component{
constructor(props){
    super(props);

    this.component = props.component;
}

    render() {
        console.log(this.component);
        return (
            <div className = "singlecomponent_container">
                <p>{ this.component.id }</p>
            </div>
        );
    }
}
export default SingleComponent;
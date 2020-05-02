import React, { Component } from 'react';
import placeholder from 'images/placeholder-rectangle.png';
import './SingleComponent.css';


class SingleComponent extends Component{
constructor(props){
    super(props);

    this.tryRequire = this.tryRequire.bind(this);

    this.component = props.component;
}

tryRequire(img_path) {
    try {
      return require('images/' + img_path);
    } catch (err) {
      return placeholder;
    }
  }

    render() {
        return (
            <div className = "singlecomponent_container">
                <img
                    className = "single_component"
                    src={ this.tryRequire(this.component.img_path) }
                    alt={ this.component.id }
                />
                <p>{ this.component.name }</p>
            </div>
        );
    }
}
export default SingleComponent;
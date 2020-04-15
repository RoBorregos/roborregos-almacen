import React, { Component } from 'react';
import image from '../../../images/4tageneracion.jpg';

class ValidLogin extends Component{
    render(){
        return(
            <div className="div_container">
                <img src = { image } alt="name" style={{borderRadius: 8, width: '600px', height:'300px'}}>

                </img>
            </div>
        );
    }
}
export default ValidLogin;
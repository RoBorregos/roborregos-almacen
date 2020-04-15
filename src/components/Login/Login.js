import React, { Component } from 'react';
import ValidLogin from './ValidLogin/ValidLogin.js';
import membersData from 'data/members.json';

class Login extends Component{
    render(){
        
        return(

            <ValidLogin membersData = { membersData.members }/>

        );
    }
}

export default Login;
import React, { Component } from 'react';
import { Col, Row, Button, Alert } from 'react-bootstrap';
import RoBorregosLogo from 'images/white_logo.png';
import { loginAPI } from 'scripts/apiScripts.js';

import './Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.onSuccess=props.onLogin;
        this.handleLogin = this.handleLogin.bind(this);
        this.handleUserID = this.handleUserID.bind(this);
        this.handleUserPassword = this.handleUserPassword.bind(this);
        
        this.state = {
            userID: "",
            userPassword: "",
            alertShow: false
        }
    }

    handleUserID(event) {
        this.setState({ userID: event.target.value });
    }

    handleUserPassword(event) {
        this.setState({ userPassword: event.target.value });
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.handleLogin();
        }
    }

    async handleLogin() {
        const sessionDetails = await loginAPI(this.state.userID,this.state.userPassword);
        if (typeof(sessionDetails.username) !== 'undefined' && sessionDetails.username !== '') {
            this.onSuccess(sessionDetails.username,sessionDetails.token);
        } else {
            this.setState({ alertShow:true });
        }
    }
    render() {
        return (
            <Col className="login_container">
                <Alert 
                    className='login_alert'
                    variant={ 'secondary' } 
                    show={ this.state.alertShow } 
                    onClose={() => this.setState({ alertShow:false })}
                    dismissible
                >
                    Username or Password Invalid.
                </Alert>
                <Row className='justify-content-sm-center'>
                    <img
                        className="login_roborregos_image"
                        src={RoBorregosLogo}
                        alt="RoBorregos Logo"
                    />
                </Row>
                <Row className='justify-content-sm-center'>
                    <input
                        className="login_input_ID"
                        type="text"
                        placeholder="A01234567"
                        onChange={this.handleUserID}
                    />
                </Row>
                <Row className='justify-content-sm-center'>
                    <input
                        className="login_input_Password"
                        type="password"
                        placeholder="Password"
                        onChange={this.handleUserPassword}
                        onKeyPress={this.handleKeyPress}
                    />
                </Row>
                <Row className='justify-content-sm-center'>
                    <Button
                        size="lg"
                        type="submit"
                        variant="outline-light"
                        className="login_button"
                        onClick={this.handleLogin}
                    >
                        Login
                    </Button>
                </Row>
            </Col>
        );
    }
}

export default Login;

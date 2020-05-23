import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import RoBorregosLogo from '../../images/white_logo.png';
import membersData from '../../data/members.json';
import Footer from 'components/Footer/Footer.js';
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
            userPassword: ""
        }
    }

    handleUserID(event) {
        this.setState({ userID: event.target.value });
    }

    handleUserPassword(event) {
        this.setState({ userPassword: event.target.value });
    }

    handleLogin() {
        let users = membersData.members;
        for (let i = 0; i < users.length; i++) {
            if (users[i].memberID === this.state.userID && users[i].password === this.state.userPassword) {
                this.onSuccess(this.state.userID);
                return;
            }
        }
        alert("Username or Password Invalid");
    }
    render() {
        return (
            <Col className="login_container">
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

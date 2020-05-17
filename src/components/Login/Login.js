import React, { Component } from 'react';
import { Row, Button } from 'react-bootstrap';
import RoBorregosLogo from '../../images/white_logo.png';
import membersData from '../../data/members.json';
import './Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleUserID = this.handleUserID.bind(this);
        this.handleUserPassword = this.handleUserPassword.bind(this);

        this.state = {
            login: true,
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
        let cookieArr = document.cookie.split(";");

        if (cookieArr[0].length == 0) {
            let users = membersData.members;
            for(let i=0; i<users.length; i++) {
                if(users[i].memberID == this.state.userID && users[i].password == this.state.userPassword) {
                    document.cookie = ("username=" +  this.state.userID + "; max-age=" + 60 / 2);
                    this.props.callBackFromParent(this.state.login);
                    return;
                }
            }
            alert("Username or Password Invalid");
        }
        else {
            this.props.callBackFromParent(true);
            return;
        }
    }
    render() {
        return (
            <div className="login_container">
                <Row className='justify-content-sm-center'>
                    <img
                        className="login_roborregos_image"
                        src={ RoBorregosLogo }
                        alt="RoBorregos Logo"
                    />
                </Row>
                <Row className='justify-content-sm-center'>
                        <input 
                            className="login_input_ID" 
                            type="text" 
                            placeholder = "A01234567"
                            onChange={ this.handleUserID } 
                        />
                </Row>
                <Row className='justify-content-sm-center'>
                        <input 
                            className="login_input_Password" 
                            type="password" 
                            placeholder = "Password"
                            onChange={ this.handleUserPassword } 
                        />
                </Row>
                <Row className='justify-content-sm-center'>
                    <Button
                        size="lg"
                        type="submit"
                        variant="outline-light"
                        className="login_button"
                        onClick={ this.handleLogin }
                    >
                        Login
                    </Button>
                </Row>
            </div>
        );
    }
}

export default Login;

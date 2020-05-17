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
        let cookieArr = document.cookie.split(",");
        for (let i = 0; i < cookieArr.length; i++) {

            let key = cookieArr[i].substring(0, cookieArr[i].indexOf('='));
            if (key[0] === "username") {
                this.props.callBackFromParent(true, key[1], key[3], key[5]);
                return;
            }
        }
        let users = membersData.members;
        for (let i = 0; i < users.length; i++) {
            if (users[i].memberID == this.state.userID && users[i].password == this.state.userPassword) {
                document.cookie = (
                    "username=" + users[i].name +
                    ", usermail=" + users[i].mail +
                    ", userID=" + this.state.userID +
                    "; max-age=" + 60 / 2
                );
                this.props.callBackFromParent(this.state.login, users[i].name, users[i].mail, users[i].memberID);
                return;
            }
            alert("Username or Password Invalid");
        }
    }
    render() {
        return (
            <div className="login_container">
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
            </div>
        );
    }
}

export default Login;

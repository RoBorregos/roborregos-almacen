import React, { Component } from 'react';
import Footer from 'components/Footer/Footer.js';
import './Profile.css';

class Profile extends Component{
    render(){
        return(
            <div className = "profile_container">
                <h2>Profile</h2>
                <Footer />
            </div>

        );
    }
}

export default Profile;
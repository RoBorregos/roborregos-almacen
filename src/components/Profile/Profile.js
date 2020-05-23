import React, { Component } from 'react';
import './Profile.css';
import memberData from '../../data/members.json'




class Profile extends Component{



    constructor(props) {
        super(props);

        this.state={
            components:[
                {
                    "name": "Raspberry Pi 3",     
                },

                {
                    "name": "Arduino uno",                
                },
                {
                    "name": "Capacitor 10 microF"
                }
            ]

           
        }

        this.state2={
            members:[
                {
                    "name": "Ricardo Chapa Romero",
                    "memberID":"A00123456",
                    "mail": "ricardochaparomero@gmail.com"
                }
            ]
        }
        
    }

   

  

  

    render(){
        return(





            <div className = "profile_container">
                <h2>Profile</h2>
                <div className = "profileBox">
                {
                       this.state2.members.map((memberD,i) =>
                       <div>
                       <p>{memberD.name} </p>
                       <p>{memberD.memberID}</p>
                       <p>{memberD.mail} </p>

                       </div>
                      
                            )
                   }

                   
                </div>
                
                <div className = "cartBox">
                 <h1>Rented components</h1>
                   {
                       this.state.components.map((comp,i) =>
                       <p>{comp.name} </p>
                            )
                   }

                </div>


               
            </div>
            


              



        );
    }
}





export default Profile;
import React, { Component } from 'react';

class ValidLogin extends Component{
  constructor(props){
    super(props);
    this.membersData = props.membersData;

    this.state = {value: ''};

    this.validateMember = this.validateMember.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
  this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  validateMember(event) {
    this.membersData.map((member, index) => {
      if(member.studentID === this.state.value) {
        return true;
      }
    });
    return false;
    event.preventDefault();
  }

    render(){
      //this.validateMember("A00789101");
        return(
            <div className="div_container">
              <form onSubmit={this.validateMember}>
               <label>
                 Name:
                 <input type="text" value={this.state.value} onChange={this.handleChange} />
               </label>
               <input type="submit" value="Submit" />
             </form>
            </div>
        );
    }
}
export default ValidLogin;

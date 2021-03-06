import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
import PhoneInput from 'react-phone-number-input/input';

// TODO add all DB columns to the payload to clear not-null violation
class RegisterForm extends Component {
  state = {
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    address: '',
    email: '',
    phone: '',
    adult: '',
    terms: '',
    role: 1,
    specialIncident: this.props.store.specialIncidentReducer,
  };

  // function to register new user
  registerUser = (event) => {
    event.preventDefault();
    if(this.state.terms === 'yes') {
      this.props.dispatch({
        type: 'REGISTER',
        payload: this.state
      });
    }
    else {
      swal('Please read and sign the terms and conditions.')
    }
  }; // end registerUser

  // function to accept input fields
  handleInputChangeFor = (propertyName) => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };

  // This function saves the phone number entered into the box
  setPhoneValue = (phoneNumber) => {
    console.log(phoneNumber);
    this.setState({
      phone: phoneNumber
    })
  }

  render() {
    return (
      <div className="editModal">
      <form className="formPanel" onSubmit={this.registerUser}>
        <h2>Register User</h2>
        {this.props.store.errors.registrationMessage && (
          <h3 className="alert" role="alert">
            {this.props.store.errors.registrationMessage}
          </h3>
        )}
        <div>
            {/* basic new user form */}
          <div>
            <input 
              type="text" 
              placeholder="Username*" 
              value={this.state.username}
              required
              onChange={this.handleInputChangeFor('username')}
              maxLength="255"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password*" 
              value={this.state.password}
              required
              onChange={this.handleInputChangeFor('password')}
              maxLength="255"
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="First Name*" 
              value={this.state.first_name}
              required
              onChange={this.handleInputChangeFor('first_name')}
              maxLength="255"
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Last Name*" 
              value={this.state.last_name}
              required
              onChange={this.handleInputChangeFor('last_name')}
              maxLength="255"
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Address" 
              value={this.state.address}
              onChange={this.handleInputChangeFor('address')}
              maxLength="500"
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Email*" 
              value={this.state.email}
              required
              onChange={this.handleInputChangeFor('email')}
              maxLength="255"
            />
          </div>
          <div>
            <PhoneInput 
              name="phoneInput"
              country="US"
              placeholder="Cell Phone*"
              value={this.state.phone}
              onChange={this.setPhoneValue}
              required
              maxlength="14"
            />
          <br/>
          <label htmlFor="phoneInput">Normal text rates may apply.</label>
          </div>
            {/* input to verify age */}
          <div>
            <label>Are you at least 18?</label>
            <br/>
            <input 
              type="radio" 
              id="yes" 
              name="adult" 
              value="yes"
              onChange={this.handleInputChangeFor('adult')}
            />
            <label htmlFor="yes">Yes</label>
            <input 
              type="radio" 
              id="no" 
              name="adult" 
              value="no"
              onChange={this.handleInputChangeFor('adult')}
            />
            <label htmlFor="no">No</label>
          </div>
          <div>
            <p>Terms and Conditions:</p>
            <p>
            <strong>If you or someone else's life is in immediate danger, please call 911 before contacting us.</strong>
            </p> 
            <p>
            The goal of the Powderhorn Safety Collective is to make the neighborhood safer and to build community by providing a non-violent presence. 
            Please keep in mind that we are your neighbors, and we are volunteers working independently of the city. 
            While we will do our best to respond as often as possible, there will be times when no one will be available, or the members who are available judge the situation to be beyond their scope (due to safety concerns, lack of qualification to address a specific incident, conflicts of interest, etc.). 
            We do not have the ability or authority to detain or arrest anyone, or investigate crimes. And while our goal is to never call the police on our neighbors, we will call 911 for life-threatening emergencies. 
            We are not an alternative to 911, instead we are a way for our neighbors to rely on each other more and the police less. 
            We look forward to meeting you.
            </p>
          </div>
            {/* terms and conditions */}
          <div>
            <input 
              type="radio" 
              id="terms" 
              name="terms" 
              value="yes" 
              onChange={this.handleInputChangeFor('terms')}/>
            <label htmlFor="terms">I accept the above terms and conditons*</label>
          </div>
            {/* option to learn more about volunteering */}
            {/* need to figure out volunteer angle */}
          <div>
            <label htmlFor="volunteer" id="volLabel">
            <input 
              type="checkbox" 
              id="volunteer" 
              name="volunteer"
              value= '0' 
              onChange={this.handleInputChangeFor('role')}
              />
            &nbsp;I would like to learn more <br/>about how to volunteer</label>
          </div>
        </div>
        <div>
          <input className="btn btn-primary" type="submit" name="submit" value="Register" />
        </div>
      </form>
      </div>
    );
  }
}

export default connect(mapStoreToProps)(RegisterForm);
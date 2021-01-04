import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import swal from 'sweetalert';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch.js';
import './ReportIncident.css';

class ReportIncident extends Component {

    state = {
        showReport: false,
        follow_incident: false,
        register: false,
        type: '',
        notes: '',
        location: '',
        time_submitted: '',
        client_id: Math.floor(Math.random() * 1010101)
    }

    componentDidMount = () => {
      this.clock();
    }

    clock = () => {
      setInterval(() => {
        this.setState({
          time_submitted : new Date().toLocaleString()
        })
      }, 1000)
    }

    handleChange = (event, typeParam) => {
      console.log(event.target.value, typeParam);
      this.setState( {
          [typeParam]: event.target.value
      });
    }

    submitReport = () => {
        console.log('clicked on report incident');
        this.setState( {
            showReport: true
        });
    }
   
    editSubmission = () => {
      this.setState( {
        showReport: false
      });
    }

    // this long function checks to see if the user wants to register an account or follow the incident, or both
    confirmIncident = () => {
      if(this.state.register === false && this.state.follow_incident === true) {
        this.props.dispatch({ type: 'POST_INCIDENT', payload: this.state });
        swal(
          `${this.state.client_id}`,
          `This is your incident ID, please write it down. Use this number to search for any updates on your incident.`, 
          {
            button: "Ok!",
        });
        this.props.history.push('/');
      }
      else if(this.state.register === true && this.state.follow_incident === false) {
        this.props.dispatch({ type: 'POST_INCIDENT', payload: this.state });
        swal(
          `Welcome!`,
          `Please input your information to register a new account.`, 
          {
            button: "Ok!",
        });
        this.props.history.push('/registration');
      }
      else if(this.state.register === false && this.state.follow_incident === false) {
        this.props.dispatch({ type: 'POST_INCIDENT', payload: this.state });
        swal(
          `Thank you!`,
          `We will respond to your reported incident.`, 
          {
            button: "Ok!",
        });
        this.props.history.push('/');
      }
      else if(this.state.register === true && this.state.follow_incident === true) {
        this.props.dispatch({ type: 'POST_INCIDENT', payload: this.state });
        swal(
          `${this.state.client_id}`,
          `This is your incident ID, please write it down. Use this number to search for any updates on your incident. 
          On the next page, please input your information to register a new account.`, 
          {
            button: "Ok!",
        });
        this.props.history.push('/registration');
      }
      }

  handleToggle = (event) => {
    if(event.target.name === 'followToggle') {
      this.setState( {
        follow_incident: !this.state.follow_incident
      });
    }else if(event.target.name === 'registerToggle') {
      this.setState( {
        register: !this.state.register
      });
    } 
  }

  render() {
    return (
    <>
    {JSON.stringify(this.state)}
    {this.state.showReport === true ? 
    <div className="registerForm">
        <h2>IS THIS CORRECT?</h2>
          <p>Time/Date: {this.state.time_submitted}</p>
          <p>Location: {this.state.location}</p>
          <p>Incident type: {this.state.type}</p>
          <p>Notes: {this.state.notes}</p>
        <br/>
          <p>Would you like to receive updates on this incident?</p>
          <ToggleSwitch toggleName="followToggle"
          handleToggle={this.handleToggle} toggleOn={this.state.follow_incident}
          />
          <p>Register with PSC and see all of your submitted incidents in one place?</p>
          <ToggleSwitch toggleName="registerToggle"
          handleToggle={this.handleToggle} toggleOn={this.state.register}
          />
        <br/>
        <br/>
          <button className="btn" onClick={this.editSubmission}>Edit Submission</button>
        <br/>
        <br/>
          <button className="btn" onClick={this.confirmIncident}>Confirm Submission</button>
    </div>
    :
    <div className="registerForm">
       <p>Current Time: <br/>
      {this.state.time_submitted}</p>
    <br/>
      <input defaultValue={this.state.location} 
            type="text" 
            placeholder="Location" 
            onChange={(event) => this.handleChange(event, 'location')}></input>
    <br/>
    <label>Gunfire
      <input className="radio" 
            type="radio" 
            value="Gunfire" 
            onChange={(event) => this.handleChange(event, 'type')} 
            name="type"></input>
    </label>
    <br/>
    <label>Armed Assault/Robbery
      <input className="radio" 
            type="radio" 
            value="Armed Assault/Robbery" 
            onChange={(event) => this.handleChange(event, 'type')} 
            name="type"></input>
      </label>
    <br/>
    <label>Assualt/Fighting
      <input className="radio" 
            type="radio"  
            value="Assualt/Fighting" 
            onChange={(event) => this.handleChange(event, 'type')} 
            name="type"></input>
      </label>
    <br/>
    <label>Fire (Please call 911 first)
      <input className="radio" 
            type="radio"  
            value="Fire (Please call 911 first)" 
            onChange={(event) => this.handleChange(event, 'type')} 
            name="type"></input>
      </label>
    <br/>
    <label>Medical Emergency
      <input className="radio" 
            type="radio"  
            value="Medical Emergency" 
            onChange={(event) => this.handleChange(event, 'type')} 
            name="type"></input>
      </label>
    <br/>
    <label>Mental Health Emergency
    <input className="radio" 
          type="radio"  
          value="Mental Health Emergency" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
      </label>
    <br/>
    <label>Drug Overdose
    <input className="radio" 
          type="radio"  
          value="Drug Overdose" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
      </label>
    <br/>
    <label>Break In/Theft
    <input className="radio" 
          type="radio"  
          value="Break In/Theft" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
      </label>
    <br/>
    <label>Vandalism
    <input className="radio" 
          type="radio"  
          value="Vandalism" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
      </label>
    <br/>
    <label>Car Accident
    <input className="radio" 
          type="radio"  
          value="Car Accident" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
      </label>
    <br/>
    <label>Vehicle Problem
    <input className="radio" 
          type="radio"  
          value="Vehicle Problem" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
      </label>
    <br/>
    <label>Police Activity
    <input className="radio" 
          type="radio"  
          value="Police Activity" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
      </label>
    <br/>
    <label>Suspicious Behavior
    <input className="radio" 
          type="radio"  
          value="Suspicious Behavior" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
      </label>
    <br/>
    <label>Unsafe Behavior
    <input className="radio" 
          type="radio"  
          value="Unsafe Behavior" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
      </label>
    <br/>
    <label>Safety Escort
    <input className="radio" 
          type="radio"  
          value="Safety Escort" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
      </label>
    <br/>
    <label>In need of neighborly help
    <input className="radio" 
          type="radio"  
          value="In need of neighborly help" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
      </label>
    <br/>
      <input className="radio" type="radio" name="type"></input>
      <label>Other</label>
      <input type="text" onChange={(event) => this.handleChange(event, 'type')}></input>
    <br/>
      <textarea defaultValue={this.state.notes} placeholder="Additional Notes" onChange={(event) => this.handleChange(event, 'notes')}></textarea>
    <br/>
      <button className="btn" onClick={this.submitReport}>Submit Incident</button>
    </div>
    }
    </>
    );
  }
}

export default connect(mapStoreToProps)(ReportIncident);


import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import swal from 'sweetalert';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch.js';
import './ReportIncident.css';
import Button from 'react-bootstrap/Button';
import patrolReducer from '../../redux/reducers/patrol.reducer';

class ReportIncident extends Component {

  state = {
      showReport: false,
      follow_incident: false,
      register: false,
      type: '',
      notes: '',
      location: '',
      time_submitted: '',
      client_id: Math.floor(Math.random() * 1010101),
      client_id_ok: false
  }

  componentDidMount = () => {
    this.clock();
    this.clientCheck();
    this.getAdmins();
  }

  // function to fetch all admins from db
  getAdmins = () => {
    this.props.dispatch( {type: 'GET_ADMINS'});
  }

  clientCheck = () => {
    // want to check to make sure client_id doesn't already exist 
    // before assigning to new incident
    // perform get request with new client_id to see if it is associated
    // with any of the incidents and make new one if it is
    this.props.dispatch({type: 'GET_CLIENT', payload: this.state.client_id});
    setTimeout(() => { 
      console.log('this.props.store.clientIdReducer', this.props.store.clientIdReducer);
      // if the client_id is not in the database yet, success
      if (this.props.store.clientIdReducer == -1) {
        this.setState({
          client_id_ok: true
        });
      }
      // if the client_id is in the database, and a new one needs to be created
      else {
        this.props.dispatch({type: 'UNSET_CLIENT_ID'});
        this.setState({
          client_id: Math.floor(Math.random() * 1010101),
        })
        this.clientCheck();
      }
    }, 500);
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
    // check to make sure inputs for type and location are valid
    let inputCheckResult = this.inputCheck();
    if (inputCheckResult !== true) {
      swal(`Please make sure there is a location and type of incident entered.`,
      {
        button: "Ok!",
      })
      return
    }
    this.setState( {
      showReport: true
    });
  }
  
  editSubmission = () => {
    this.setState( {
      showReport: false
    });
  }

  inputCheck = () => {
    if (this.state.type && this.state.location) {
      return true
    }
    else {
      return false
    }
  }

  // this function checks to see if the user wants to register an account or follow the incident, or both
  confirmIncident = () => {
    // if user logged in
    if (this.props.store.user.id) {
      // 1. if logged in user wants to follow incident 
      if (this.state.follow_incident) {
        this.props.dispatch({ type: 'POST_INCIDENT', payload: this.state });
        swal(
          `${this.state.client_id}`,
          `This is your incident ID, please write it down. Use this number to search for any updates on your incident.`, 
          {
            button: "Ok!",
        });
        this.sendMessage();
        this.props.history.push('/');
      }
      // 2. if logged in user does not want to follow incident
      else {
        this.props.dispatch({ type: 'POST_INCIDENT', payload: this.state });
        swal(
          `Thank you!`,
          `We will respond to your reported incident.`, 
        {
          button: "Ok!",
        });
        this.sendMessage();
        this.props.history.push('/');
      }
    } // end logged in user section
    // if user not logged in
    else {
      // 3. if not logged in user wants to register
      if (this.state.register === true) {
        this.props.dispatch({ type: 'POST_INCIDENT', payload: this.state });
        this.props.dispatch({type: 'SPECIAL_INCIDENT', payload: this.state.client_id})
        swal(
          `${this.state.client_id}`,
          `This is your incident ID, please write it down. Use this number to search for any updates on your incident. 
          On the next page, please input your information to register a new account.`, 
          {
            button: "Ok!",
        });
        this.sendMessage();
        this.props.history.push('/registration');
      }
      // 4. if not logged in user only wants to submit incident and not register
      else {
        this.props.dispatch({ type: 'POST_INCIDENT', payload: this.state });
        swal(
          `${this.state.client_id}`,
          `This is your incident ID, please write it down. Use this number to search for any updates on your incident.`, 
          {
            button: "Ok!",
        });
        this.sendMessage();
        this.props.history.push('/');
      }
    }// end not logged in user section
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

  // this function should send the message to all the people on patrol and on call
  // to say that a new incident has been submitted
  sendMessage = (incidentId) => {
    const onCall = this.props.store.onCallReducer;
    const patrol = this.props.store.patrolReducer; 
    // for(let i = 0; i < onCall.length; i++) {
    //   console.log('call for', onCall[i].incident_id, incidentId);
    //   console.log('################', onCall[i].phone);
    //   this.props.dispatch({type: 'MAKE_PHONE_MESSAGE_FOR_NEW_INCIDENT', payload: {phone: onCall[i].phone}});
    // }
    // const patrol = this.props.store.patrolReducer;
    // for (let i = 0; i < patrol.length; i++) {
    //   console.log('patrol for #########', patrol[i].phone);
    //   this.props.dispatch({type: 'MAKE_PHONE_MESSAGE_FOR_NEW_INCIDENT', payload: {phone: patrol[i].phone}});
    // }

    //////////////////////////////////////////////////////////////////////
    // fix to add admin to text message, also
    let callPatrolAdminArray = [];
    for(let i = 0; i < onCall.length; i++) {
      callPatrolAdminArray.push(onCall[i])
    }
    for(let i = 0; i < patrol.length; i++) {
      callPatrolAdminArray.push(patrol[i]); 
    }
    console.log('callPatrolAdminArray', callPatrolAdminArray);
    // at this point, the callPatrolAdminArray should have all members in it who are on
    // call or on patrol and needs admins added to it, but not ones who are already in the array
    console.log(this.props.store.allUserReducer);
    
    
  }

  render() {
    return (
    <>
    {this.state.showReport === true ? 
    <div className="registerForm">
        <h2>IS THIS CORRECT?</h2>
          <p>Time/Date: {this.state.time_submitted}</p>
          <p>Location: {this.state.location}</p>
          <p>Incident type: {this.state.type}</p>
          <p>Notes: {this.state.notes}</p>
        <br/>
          {this.props.store.user.id ?
            <>
              <p>Would you like to receive text updates on this incident?</p>
              <ToggleSwitch toggleName="followToggle"
                handleToggle={this.handleToggle} toggleOn={this.state.follow_incident}
              />
            </>
          :
          <>
            <p>Register with PSC and see all of your submitted incidents in one place?</p>
            <ToggleSwitch toggleName="registerToggle"
              handleToggle={this.handleToggle} toggleOn={this.state.register}
            />
            <br/>
            <br/>
            <p>To receive text updates for this incident, please register as a user.
            Registered users may follow specific incidents to receive text updates.</p>
          </>
          }
        <br/>
        <br/>
        <Button id="confirm" className="btn btn-primary" onClick={this.editSubmission}>Edit Submission</Button>
        <Button id="confirm" className="btn btn-success" onClick={this.confirmIncident}>Confirm Submission</Button>
    </div>
    :
    <div className="registerForm">
      <h2>Report Incident Form</h2>
      <br/>
      <input defaultValue={this.state.location} 
            type="text" 
            placeholder="Location" 
            onChange={(event) => this.handleChange(event, 'location')}></input>
    <br/>
    <label>
      <input className="radio" 
            type="radio" 
            value="Gunfire" 
            onChange={(event) => this.handleChange(event, 'type')} 
            name="type"></input>
            Gunfire
    </label>
    <br/>
    <label>
      <input className="radio" 
            type="radio" 
            value="Armed Assault/Robbery" 
            onChange={(event) => this.handleChange(event, 'type')} 
            name="type"></input>
            Armed Assault/Robbery
      </label>
    <br/>
    <label>
      <input className="radio" 
            type="radio"  
            value="Assualt/Fighting" 
            onChange={(event) => this.handleChange(event, 'type')} 
            name="type"></input>
            Assualt/Fighting
      </label>
    <br/>
    <label>
      <input className="radio" 
            type="radio"  
            value="Fire (Please call 911 first)" 
            onChange={(event) => this.handleChange(event, 'type')} 
            name="type"></input>
            Fire (Please call 911 first)
      </label>
    <br/>
    <label>
      <input className="radio" 
            type="radio"  
            value="Medical Emergency" 
            onChange={(event) => this.handleChange(event, 'type')} 
            name="type"></input>
            Medical Emergency
      </label>
    <br/>
    <label>
    <input className="radio" 
          type="radio"  
          value="Mental Health Emergency" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
          Mental Health Emergency
      </label>
    <br/>
    <label>
    <input className="radio" 
          type="radio"  
          value="Drug Overdose" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
          Drug Overdose
      </label>
    <br/>
    <label>
    <input className="radio" 
          type="radio"  
          value="Break In/Theft" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
          Break In/Theft
      </label>
    <br/>
    <label>
    <input className="radio" 
          type="radio"  
          value="Vandalism" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
          Vandalism
      </label>
    <br/>
    <label>
    <input className="radio" 
          type="radio"  
          value="Car Accident" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
          Car Accident
      </label>
    <br/>
    <label>
    <input className="radio" 
          type="radio"  
          value="Vehicle Problem" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
          Vehicle Problem
      </label>
    <br/>
    <label>
    <input className="radio" 
          type="radio"  
          value="Police Activity" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
          Police Activity
      </label>
    <br/>
    <label>
    <input className="radio" 
          type="radio"  
          value="Suspicious Behavior" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
          Suspicious Behavior
      </label>
    <br/>
    <label>
    <input className="radio" 
          type="radio"  
          value="Unsafe Behavior" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
          Unsafe Behavior
      </label>
    <br/>
    <label>
    <input className="radio" 
          type="radio"  
          value="Safety Escort" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
          Safety Escort
      </label>
    <br/>
    <label>
    <input className="radio" 
          type="radio"  
          value="In need of neighborly help" 
          onChange={(event) => this.handleChange(event, 'type')} 
          name="type"></input>
          In need of neighborly help
      </label>
    <br/>
    <label>
      <input className="radio" type="radio" name="type"></input>
      Other</label>
      <input type="text" onChange={(event) => this.handleChange(event, 'type')}></input>
    <br/>
      <textarea defaultValue={this.state.notes} placeholder="Additional Notes" onChange={(event) => this.handleChange(event, 'notes')}></textarea>
    <br/>
      <Button className="btn btn-primary" onClick={this.submitReport}>Submit Incident</Button>
    </div>
    }
    </>
    );
  }
}

export default connect(mapStoreToProps)(ReportIncident);

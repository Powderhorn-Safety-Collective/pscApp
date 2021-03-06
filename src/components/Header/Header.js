import React, { Component } from 'react';
import { connect } from 'react-redux';
import {HashRouter as Link} from 'react-router-dom';
import {withRouter} from 'react-router';
import "./Header.css";
import Nav from '../Nav/Nav';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch.js';
import Button from "react-bootstrap/Button";
import mapStoreToProps from '../../redux/mapStoreToProps';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class Header extends Component {

  state = {
    onPatrol: '',
    onCall: ''
  }

  componentDidMount = () => {
    this.props.dispatch({type: "GET_PATROL_COUNT"});
    this.props.dispatch({type: "GET_ON_CALL_COUNT"});
    this.props.dispatch({type: 'GET_ACTIVE'}); // dispatch to GET count of all active incidents
    this.props.dispatch( {type: 'GET_PUBLIC_INCIDENTS'}); //dispatch to GET all active incidents
  }

  // This function is called whenever either one of the toggles is switched
  // for 'on patrol' or 'on call'
  handleToggle = (event) => {
    // if 'on patrol' is switched from on to off
    if(event.target.name === 'onPatrolToggle' && 
      this.props.store.user.on_patrol == true) {
      console.log('option 1');
      // for this one, we want to only turn off the 'on patrol' boolean
      this.sendPatrolStatus();
    }
    // if 'on call' is switched from on to off
    else if (event.target.name ==='onCallToggle' && 
      this.props.store.user.on_call == true) {
      console.log('option 2');
      // for this one, we want to only turn off the 'on call' boolean
      this.sendCallStatus();
    }
    // if 'on patrol' is switched from off to on
    else if(event.target.name === 'onPatrolToggle' && 
      this.props.store.user.on_patrol == false) {
      if (this.props.store.user.on_call == true) {
        console.log('option 3');
        // want to turn 'on call' off here
        this.sendCallStatus(true);
      }
        console.log('option 4');
        // want to turn 'on patrol' on here
        this.sendPatrolStatus();
    } 
    // if 'on call' is switched from off to on
    else if (event.target.name === 'onCallToggle' && 
      this.props.store.user.on_call == false) {
      if (this.props.store.user.on_patrol == true) {
        console.log('option 5');
        // want to turn 'on patrol' off here
        this.sendPatrolStatus();
      }
        console.log('option 6');
        // want to turn 'on call' on here
        this.sendCallStatus(); 
    }
  }
  
  // This function toggles the value for on_patrol for the user
  sendPatrolStatus = () => {
    this.props.dispatch({
      type: 'ADD_PATROL_STATUS',
      payload: {patrolValue: !this.props.store.user.on_patrol}
    })
  }

  // This function toggles the value for on_call for the user
  sendCallStatus = () => {
    this.props.dispatch({
      type: 'ADD_CALL_STATUS',
      payload: {onCallValue: !this.props.store.user.on_call}
    })
  }

// function to open report incident modal
  reportIncident = () => {
    this.props.history.push('/report');
  }

// determines which dashboard a user will arrive at based on their role
  viewIncidents= () => {
    if (!this.props.store.user.role || this.props.store.user.role < 2){
      this.props.history.push('/community');
    }else if(this.props.store.user.role === 2) {
      this.props.history.push('/member');
    }else if (this.props.store.user.role === 3) {
      this.props.history.push('/admin');
    }
  }
  
  render() {
    return ( 
      <Container fluid>
        <Row className="titleContainer">
          <Col lg = {4} xs={12} >
            <Link to="/community">
              <img src="/logo.png" alt="PSC Logo"/>
            </Link>
          </Col>
          <Col lg ={4} xs={12}>
            <div className="patrolDisplay">
              {Number(this.props.store.patrolCountReducer.count) === 1 && 
                <h5> 1 person is on patrol</h5>
              }
              {Number(this.props.store.patrolCountReducer.count) === 0 &&
                <h5>No One is on Patrol</h5>
              }
              {Number(this.props.store.patrolCountReducer.count) > 1 &&
                <h5>{this.props.store.patrolCountReducer.count} people are on patrol</h5>
              }
              {Number(this.props.store.onCallCountReducer.count) === 1 && 
                <h5>1 person is on call</h5>
              }
              {Number(this.props.store.onCallCountReducer.count) === 0 && 
                <h5>No One is On Call</h5>
              }
              {Number(this.props.store.onCallCountReducer.count) > 1 && 
                <h5>{this.props.store.onCallCountReducer.count} people are on call</h5>
              }
              <div className="incidents" onClick={this.viewIncidents}>
                {this.props.store.user.role > 1 ?
                  <h5> {this.props.store.activeIncidentReducer} active incidents</h5>
                  :
                  <h5>Current Incident Count: {this.props.store.publicIncidentReducer.length}</h5>
                }
              </div>
            </div>
            <Row>
              <div className="headerBtns">
                {/* on patrol / on call toggles */}
                {this.props.store.user.role > 1 &&
                  <div className="toggleForm">
                    <label className="whiteText" for="onPatrolToggle">On Patrol:</label>
                    {this.props.store.user.on_patrol !== undefined &&
                      <ToggleSwitch 
                        toggleName="onPatrolToggle"
                        handleToggle={this.handleToggle} 
                        toggleOn={this.props.store.user.on_patrol}
                        name="onPatrolToggle"
                      />
                    }

                    <label className="whiteText" for="onCallToggle">On Call:</label>
                    {this.props.store.user.on_call !== undefined &&
                      <ToggleSwitch 
                        toggleName="onCallToggle"
                        handleToggle={this.handleToggle} 
                        toggleOn={this.props.store.user.on_call}
                        name="onCallToggle"
                      />
                    }
                  </div>
                }  
              </div>
            </Row>
          </Col>
      
          <Col lg = {4} xs = {12}> 
            {this.props.store.user.first_name ?
              <p className="whiteText">Hello, {this.props.store.user.first_name}!</p>
            :
              <p className="whiteText">Please Login</p> 
            }
            <Row>
              <Col lg={6} xs={6}>
                <Nav/>
              </Col>
              <Col lg = {6} xs={6}>
                <Button variant="warning" onClick={this.reportIncident}> Report an Incident</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default withRouter(connect(mapStoreToProps)(Header));

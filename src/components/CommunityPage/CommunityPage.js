
import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';//connects this component to the ReduxStore
import LoginForm from '../LoginForm/LoginForm';
import './CommunityPage.css';
import IncidentSearch from '../IncidentSearch/IncidentSearch';
import IncidentModule from '../IncidentModule/IncidentModule';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Mailchimp from 'react-mailchimp-form'
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

// Community Page component
// visible to everyone
// contains organization info and links, a list of incidents, and
// a section for login and a ection to search for an incident
class CommunityPage extends Component {
  
  state = {
    aboutOpen: false,
    missionOpen: false,
  };
// function to render the timestamp into a readable format
  renderTime = (time) => {
    let timeHour = Number(time.slice(11,13));
    let timeMorningEvening = 'a.m.';
    if (timeHour > 12) {
      timeHour -= 12;
      timeMorningEvening = 'p.m.';
    }
    else if (timeHour === 0) {
      timeHour = 12;
    }
    let timeMinute = time.slice(14, 16);
    let month = Number(time.slice(5,7));
    let day = Number(time.slice(8,10));
    let year = Number(time.slice(0,4));
    let displayTime = timeHour + ':' + timeMinute + ' ' + timeMorningEvening + ' ' + month + '/' + day + '/' + year;
    return displayTime
  }

  // GET request is called on page load
  // to retrieve all incident data for incidents marked for public view
  componentDidMount = () => {
    this.getPublicIncidents();
    if (this.props.store.user) {
      this.getFollowedIncidentIds();
    }
  }

  // get all the incidents a given user is following
  getFollowedIncidentIds = () => {
    this.props.dispatch({type: 'GET_FOLLOWED_INCIDENTS'});
  }

  // function to fetch all incident data for public view
  getPublicIncidents = () => {
    this.props.dispatch( {type: 'GET_PUBLIC_INCIDENTS'});
  }

  // User can click this button to request a follow up from PSC on an incident
  renderContactRequest = (incidentId) => {
    if (this.props.store.user.id) {
      if (this.props.store.followedIncidentsReducer.some(incident => incident.incident_id === incidentId)) {
        return <Button onClick={() => this.unfollowIncident(incidentId)} variant="success">Stop Following this Incident</Button>
      }
      else {
        return <Button onClick={() => this.followIncident(incidentId)}>Follow this Incident</Button>
      }
    }
    else {
      return <p>You may follow this incident if you are registered as a PSC user and logged in</p>
    }
  }

  // function to dispatch action to follow incident
  followIncident = (incidentId) => {
    console.log('follow incident id', incidentId);
    this.props.dispatch({type: 'FOLLOW_INCIDENT', payload: {incident_Id: incidentId}});
  }

  // function to dispatch action to stop following incident
  unfollowIncident = (incidentId) => {
    console.log('unfollow incident id', incidentId);
    this.props.dispatch({type: 'UNFOLLOW_INCIDENT', payload: {incident_Id: incidentId}});
  }


  render() {
    return (
      <Container fluid>
        <Row id="topBoxes">
{/* This div has the boxes at the top of the page */}
            <div className="box">
              <a className="links" target="_blank" href="https://www.powderhornsafetycollective.org" rel="noopener noreferrer">
                <h2>
                  Community Resources
                </h2>
              </a>
            </div>
            <div className="box">
              <a className="links" target="_blank" href="https://www.facebook.com/Powderhorn-Safety-Collective-110798767447531/" rel="noopener noreferrer">
                <h2>
                  Community Events
                </h2>
              </a>
            </div>
            <div className="box">
              <h2>
                <a className="emailLink" href='mailto: pohosafetycollective@gmail.com'>Contact Us</a>
              </h2>
            </div>
          </Row>
{/* These Are the incidents */}
        <Row>
          <Col></Col>
          <Col md={8} lg={6}    className="communityColumnCenter">
            <Row className="box scrollable" >
              <h2 className="whiteText">
                Public Notices
              </h2>
{/* incident cards are mapped onto cards for display here */}
                {this.props.store.publicIncidentReducer.map( (publicIncident, index) => {
                    const followedIncidents = this.props.store.followedIncidentsReducer
                  return(
                    <IncidentModule incident={publicIncident} key={index} followedIncidents={followedIncidents}/>
                  );
                })}
            </Row>
          </Col>{/* end middle stuff */}
          <Col></Col>
{/* these items will usually display on the Right, login, search, etc */}
          
          <Col md={6} lg={4} className="communityColumnRight">
          {this.props.store.user.role ?
            <></>
            :
            <Row className="box">
{/* section to login */}
              <LoginForm/>
            </Row>
            }
            <Row className="box" id="collapseBox">
              <Button
                onClick={()=> this.setState({aboutOpen: !this.state.aboutOpen})}
                aria-controls="collapseAbout"
                aria-expanded={this.state.aboutOpen}
                className="collapseBtn"
              >About Us</Button>
                <Collapse in={this.state.aboutOpen}>
                  <div id="aboutBody" className="white">
                  The Powderhorn Safety Collective is a community organization in the Powderhorn Park neighborhood of Minneapolis, MN.
                  </div>
                </Collapse>
                <Button
                  onClick={()=> this.setState({missionOpen: !this.state.missionOpen})}
                  aria-controls="collapseAbout"
                  aria-expanded={this.state.missionOpen}
                  className="collapseBtn"
                >Mission</Button>
                <Collapse in={this.state.missionOpen}>
                  <div id="missionBody" className="white">
                    <p>
                      The Powderhorn Safety Collective (PSC) envisions a new form of community response that calls upon the resources of the neighborhood rather than the police. 
                      We are neighbors providing support to the community with compassion and care in mind. 
                      As a collective we commit to the practices of nonviolence and de-escalation with the end goal of strengthening the social fabric of the neighborhood.  
                    </p>
                    <p>
                      El Colectivo Seguridad del Powderhorn (PSC) imaginamos una nueva forma de respuesta comunal que solicita a los recursos del vecindario en vez de la policía. 
                      Somos vecinos, proveyendo apoyo a la comunidad, teniendo en mente la compasión y el cuidado. 
                      Como colectivo, nos comprometemos a la práctica de no violencia y la desescalada, con la meta de hacer más fuerte la fábrica social del vecindario.
                    </p>              
                  </div>
                </Collapse>
                <Button
                onClick={()=> this.setState({howOpen: !this.state.howOpen})}
                aria-controls="collapseHow"
                aria-expanded={this.state.howOpen}
                className="collapseBtn"
              >How to Use</Button>
                <Collapse in={this.state.howOpen}>
                  <div id="howBody" className="white">
                    
                    <h4>Welcome to Powderhorn Safety Collective (PSC)!</h4>
                    <div> 
                      <h5>How do I use PSC?</h5>
                      <p>You can use PSC without signing up! Anyone in the community can:</p>
                        <ul>
                        <li>Report incidents</li>
                        <li>Follow and view incidents</li>
                        <li>Look up incidents with an incident ID number.</li>
                        <li>Join the PSC mailing list</li>
                        </ul>
                      <p><mark>When an incident is reported it is not posted to the community page right away.</mark> PSC admins will assign and look over your newly posted incident before sharing it with the public. </p>

                      <p>Want to be able to utilize PSC even more? Register for a free account!</p>
                    </div>



                    <div>
                      <h5>What is a PSC Volunteer?</h5>
                      <p>PSC Volunteers are here for the community to:</p>
                      <ul>
                        <li>Patrol the neighborhood and respond to incidents</li>
                        <li>Update existing incidents with new information</li>
                        <li>Notify you and the community about urgent incidents.</li>
                      </ul>
                      </div>

                  <div>
                  <h5>And how about PSC Admins?</h5>

                    <ul>
                      <li>Manage, update, and assign incidents to volunteers to incidents as they are reported</li>
                      <li>Connect with volunteers and community members about incidents happening in Powderhorn.</li>
                      <li>Answer any and all of your questions about PSC!</li>
                    </ul>
                  </div>



                  </div>
                </Collapse>
            </Row>
{/* end of login Column */}
            <Row className="box">
{/* section to search for an incident */}
              <IncidentSearch/>
{/* Render the searched incident to the DOM, not using incident module, because incident will show even if not publicly viewable in this module */}
            {this.props.store.searchIncidentReducer.client_id &&
            <div className="white">
              <p className="yellowBackground"><strong>Incident ID: </strong>{this.props.store.searchIncidentReducer.client_id}</p>
              <p><strong>Incident Type: </strong>{this.props.store.searchIncidentReducer.type}</p>
              <p><strong>Incident Time: </strong>{this.renderTime(this.props.store.searchIncidentReducer.time_submitted)}</p>
              <p><strong>Reporter Notes: </strong>{this.props.store.searchIncidentReducer.notes}</p>
              {this.props.store.searchIncidentReducer.active === true ? <p className="alert">Active</p> : <p className = "alert">Resolved</p>}
              {this.renderContactRequest(this.props.store.searchIncidentReducer.id)}
            </div>
            }
            {this.props.store.searchIncidentReducer === "" &&
              <p>No Incident with that ID was found, please try again.</p>
            }
            </Row>
          </Col> 
{/* end of search incident */}
          <Col></Col>
{/* seperate row for displaying mailchimp form */}
        </Row>
            <Row id="newsBox">
              <h4> Sign Up for the PSC Newsletter
              <Mailchimp 
                action='"https://conniemoffett.us17.list-manage.com/subscribe/post?u=708a00624e362f504e2fbe541&amp;id=605b398d96'
                fields={[
                  {
                    name: 'EMAIL',
                    placeholder: 'Email',
                    type: 'email',
                    required: true,
                  }
                ]}
                messages = {
                  {
                    sending: "Sending...",
                    success: "Thank you for subscribing!",
                    error: "An unexpected internal error has occurred, please try again.",
                    empty: "You must type in a valid e-mail address.",
                    duplicate: "This email has already been used to sign up!",
                    button: "Subscribe"
                  }
                }
                />
              </h4>
            </Row>
{/* end mailchimp row */}
      </Container>
    );
  }
}

export default connect(mapStoreToProps)(CommunityPage);



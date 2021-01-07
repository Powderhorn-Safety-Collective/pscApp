import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import mapStoreToProps from '../../redux/mapStoreToProps';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import './UserPage.css';
import IncidentModule from '../IncidentModule/IncidentModule';
import Mailchimp from 'react-mailchimp-form'

// this will be the page a registered user sees when they log in if they are not a volunteer
class UserPage extends Component {
  
  // GET request is called on page load
  // to retrieve all incident data for incidents marked for public view
  componentDidMount = () => {
    this.getPublicIncidents();
    this.getPersonalIncidents();
    if (this.props.store.user) {
      this.getFollowedIncidentIds();
    }
  }

  getFollowedIncidentIds = () => {
    this.props.dispatch({type: 'GET_FOLLOWED_INCIDENTS'});  
  }

  // function to fetch all incident data for public view
  getPublicIncidents = () => {
    this.props.dispatch( {type: 'GET_PUBLIC_INCIDENTS'});
  }

  // function to fetch incidents this user submitted or is following
  getPersonalIncidents = () => {
    this.props.dispatch({type: 'GET_PERSONAL_INCIDENTS', payload: {id: this.props.store.user.id}});
  }

  render() {
    return (
      <Container fluid>
        <Row>
          {/* left column with community links */}
          <Col lg={3} className="userModule">
          <Row className="box">
              {/* we can put whatever site they want here later */}
              <a className="links" target="_blank" href="https://www.facebook.com/Powderhorn-Safety-Collective-110798767447531/" rel="noopener noreferrer">
                <h2>
                  Community Resources
                </h2>
              </a>
            </Row>
            <Row className="box">
              {/* we will change link later */}
              <a className="links" target="_blank" href="https://www.facebook.com/Powderhorn-Safety-Collective-110798767447531/" rel="noopener noreferrer">
                <h2>
                  Community Events
                </h2>
              </a>
            </Row>
            <Row className="box">
              <a className="links" target="_blank" href="https://www.powderhornsafetycollective.org/" rel="noopener noreferrer">
                <h2>
                  PSC Contact Info
                </h2>
              </a>
            </Row>
            <Row className="box">
              <h2>
              Sign Up for the PSC Newsletter
              <Mailchimp
              action='https://gmail.us7.list-manage.com/subscribe/post?u=6648d06c78d7cae5c47a9580d&amp;id=7ab777aba9'
              fields={[
                {
                  name: 'EMAIL',
                  placeholder: 'Email',
                  type: 'email',
                  required: true
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
            /></h2>
            </Row>
          </Col>
          {/* center column with publicly posted incidents */}
          <Col lg={5} className="userModule">
          <h2>
                Incidents
              </h2>
                {/* incident cards are mapped onto cards for display here */}
                {this.props.store.publicIncidentReducer.map( (publicIncident, index) => {
                  const followedIncidents = this.props.store.followedIncidentsReducer
                  return(
                    <IncidentModule incident={publicIncident} key={index} followedIncidents={followedIncidents}/>
                  );
                })}
          </Col>
          {/* right column with incidents user submitted or is following */}
          <Col lg={4} className="userModule">
            <h3>Incidents that you submitted or are following will show up here</h3>
            {this.props.store.personalIncidentReducer.map( (personalIncident, index) => {
              return(
                <IncidentModule incident={personalIncident} key={index}/>
              );
            })}
          </Col>
        </Row>
      </Container>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStoreToProps)(UserPage);

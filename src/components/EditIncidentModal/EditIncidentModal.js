import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import Button from 'react-bootstrap/Button';

class EditIncidentModal extends Component {
// state is populated with current data from this incident
    state = {
      id: this.props.store.editIncidentReducer.id,
      type: this.props.store.editIncidentReducer.type,
      notes: this.props.store.editIncidentReducer.notes,
      location: this.props.store.editIncidentReducer.location,
      time_submitted: this.props.store.editIncidentReducer.time_submitted,
      active: this.props.store.editIncidentReducer.active,
      view_publicly: this.props.store.editIncidentReducer.view_publicly,
      responder_notes: this.props.store.editIncidentReducer.notes,
      duplicate_entry: this.props.store.editIncidentReducer.duplicate_entry,
      client_id: this.props.store.editIncidentReducer.client_id,
      }
// updates state with user input for the given event  
      handleChange = (event, typeParam) => {
        this.setState( {
            [typeParam]: event.target.value
        });
      }
// sends dispatch to update an incident with new data 
      submitEdit = () => {
        this.props.dispatch( {type: 'SUBMIT_EDIT_INCIDENT', payload: this.state} );
        this.props.history.push('/history');
      }
// back button
      goBack = () => {
        this.props.history.push('/history');
      }
    
  render() {
    return (
      <div>
            {this.props.store.editIncidentReducer ? 
            <div className="editModal">
                <label>Id</label>
                <input defaultValue={this.props.store.editIncidentReducer.id} type="text"></input>
                <br/>
                <label>Type</label>
                <input defaultValue={this.props.store.editIncidentReducer.type} onChange={(event) => this.handleChange(event, 'type')} type="text"></input>
                <br/>
                <label>Notes</label>
                <input defaultValue={this.props.store.editIncidentReducer.notes} onChange={(event) => this.handleChange(event, 'notes')} type="text"></input>
                <br/>
                <label>Location</label>
                <input defaultValue={this.props.store.editIncidentReducer.location} onChange={(event) => this.handleChange(event, 'location')} type="text"></input>
                <br/>
                <label>Time Submitted</label>
                <input defaultValue={this.props.store.editIncidentReducer.time_submitted} onChange={(event) => this.handleChange(event, 'time_submitted')} type="text"></input>
                <br/>
                <label>Active</label>
                <input defaultValue={this.props.store.editIncidentReducer.active} onChange={(event) => this.handleChange(event, 'active')} type="text"></input>
                <br/>
                <label>View Publicly</label>
                <input defaultValue={this.props.store.editIncidentReducer.view_publicly} onChange={(event) => this.handleChange(event, 'view_publicly')} type="text"></input>
                <br/>
                <label>Responder Notes</label>
                <input defaultValue={this.props.store.editIncidentReducer.responder_notes} onChange={(event) => this.handleChange(event, 'responder_notes')} type="text"></input>
                <br/>
                <label>Duplicate</label>
                <input defaultValue={this.props.store.editIncidentReducer.duplicate_entry} onChange={(event) => this.handleChange(event, 'duplicate_entry')} type="text"></input>
                <br/>
                <label>Client Id</label>
                <input defaultValue={this.props.store.editIncidentReducer.client_id} onChange={(event) => this.handleChange(event, 'client_id')} type="text"></input>
                <br/>
                  <Button onClick={this.submitEdit} variant="primary">Submit Edit</Button>
                <br/>
                  <Button onClick={this.goBack} variant="warning">Back to Data Table</Button>
            </div>
            :
            <></>
            }
      </div>
    );
  }
}

export default connect(mapStoreToProps)(EditIncidentModal);
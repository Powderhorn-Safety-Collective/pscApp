import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import Button from 'react-bootstrap/Button';
import SkillsForm from '../SkillsForm/SkillsForm';


class EditUserModal extends Component {

  state = {
    id: '',
    username: '',
    first_name: '',
    last_name: '',
    address: '',
    email: '',
    phone: '',
    adult: '',
    on_patrol: '',
    on_call: '',
    role: '',
    skills: []
  }
  
  componentDidMount = () => {
    this.skillList()
    this.setState( {
      id: this.props.store.editUserReducer.id,
      username: this.props.store.editUserReducer.username,
      first_name: this.props.store.editUserReducer.first_name,
      last_name: this.props.store.editUserReducer.last_name,
      address: this.props.store.editUserReducer.address,
      email: this.props.store.editUserReducer.email,
      phone: this.props.store.editUserReducer.phone,
      adult: this.props.store.editUserReducer.adult,
      on_patrol: this.props.store.editUserReducer.on_patrol,
      on_call: this.props.store.editUserReducer.on_call,
      role: this.props.store.editUserReducer.role,
      skills: this.skillList()
    })
  }
  // creates a list of all the skills for the user in that row
  skillList = () => {
    const skillArray=[];
    this.props.store.userSkillsReducer.map((skill) => {
      if(skill.user_id === this.props.store.editUserReducer.id) {
        skillArray.push(skill)
      }
    })
    return skillArray;
  }

  handleChange = (event, typeParam) => {
    console.log(event.target.value, typeParam);
  
    this.setState( {
        [typeParam]: event.target.value
    })
  }

  submitEdit = () => {
    console.log('editing user');
    this.props.dispatch( {type: 'SUBMIT_EDIT_USER', payload: this.state} );
    this.props.history.push('/edit');
  }

  goBack = () => {
    this.props.history.push('/edit');
  }

  render() {
    return (
      <div>
        <p>editUserReducer:</p>
        {JSON.stringify(this.props.store.editUserReducer)}
        <p>state:</p>
        {JSON.stringify(this.state)}
          {this.props.store.editUserReducer ? 
          <div className="editModal">
          <label>Id</label>
          <input defaultValue={this.props.store.editUserReducer.id} type="text"></input>
          <br/>
          <label>Username</label>
          <input defaultValue={this.props.store.editUserReducer.username} onChange={(event) => this.handleChange(event, 'username')} type="text"></input>
          <br/>
          <label>First Name</label>
          <input defaultValue={this.props.store.editUserReducer.first_name} onChange={(event) => this.handleChange(event, 'first_name')} type="text"></input>
          <br/>
          <label>Last Name</label>
          <input defaultValue={this.props.store.editUserReducer.last_name} onChange={(event) => this.handleChange(event, 'last_name')} type="text"></input>
          <br/>
          <label>Address</label>
          <input defaultValue={this.props.store.editUserReducer.address} onChange={(event) => this.handleChange(event, 'address')} type="text"></input>
          <br/>
          <label>Email</label>
          <input defaultValue={this.props.store.editUserReducer.email} onChange={(event) => this.handleChange(event, 'email')} type="text"></input>
          <br/>
          <label>Phone</label>
          <input defaultValue={this.props.store.editUserReducer.phone} onChange={(event) => this.handleChange(event, 'email')} type="text"></input>
          <br/>
          <label>Adult</label>
          <input defaultValue={this.props.store.editUserReducer.adult} onChange={(event) => this.handleChange(event, 'adult')} type="text"></input>
          <br/>
          <label>On Patrol</label>
          <input defaultValue={this.props.store.editUserReducer.on_patrol} onChange={(event) => this.handleChange(event, 'on_patrol')} type="text"></input>
          <br/>
          <label>On Call</label>
          <input defaultValue={this.props.store.editUserReducer.on_call} onChange={(event) => this.handleChange(event, 'on_call')} type="text"></input>
          <br/>
          <label>Role</label>
          <input defaultValue={this.props.store.editUserReducer.role} onChange={(event) => this.handleChange(event, 'role')} type="text"></input>
          {/* <ul>
            {this.state.skills.map((skill) => {
              return <li>{skill.description}</li>
            })}
          </ul> */}
          <br></br>
          <SkillsForm/>
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

export default connect(mapStoreToProps)(EditUserModal);
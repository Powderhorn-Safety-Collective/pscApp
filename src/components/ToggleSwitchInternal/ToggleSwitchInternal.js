import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ToggleSwitchInternal.scss';
import mapStoreToProps from '../../redux/mapStoreToProps';

class ToggleSwitchInternal extends (Component) {
// reusable toggle switch for internal incidents
  render() {
    return(
      <div className="toggle-switch-int">
        <input 
          type="checkbox"
          defaultChecked={this.props.toggleOn}
          onChange={this.props.handleToggle}
          className="toggle-switch-checkbox"  
          name={this.props.toggleName}
          id={this.props.toggleName}/>
        <label 
          className="toggle-switch-label" 
          htmlFor={this.props.toggleName}
        >
          <span 
            className="toggle-switch-inner" 
            data-yes="Show" 
            data-no="Hide">
          </span>
          <span 
            className="toggle-switch-switch">
          </span>
        </label>
      </div>
    )
  }
}

export default connect(mapStoreToProps)(ToggleSwitchInternal);
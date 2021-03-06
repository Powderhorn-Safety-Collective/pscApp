import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ToggleSwitch.scss';
import mapStoreToProps from '../../redux/mapStoreToProps';

class ToggleSwitch extends (Component) {
// reu usable toggle switch component with styling
  render() {
    return(
      <div className="toggle-switch">
        <input 
          type="checkbox"
          checked={this.props.toggleOn}
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
            data-yes="Yes" 
            data-no="No">
          </span>
          <span 
            className="toggle-switch-switch">
          </span>
        </label>
      </div>
    );
  }
}

export default connect(mapStoreToProps)(ToggleSwitch);
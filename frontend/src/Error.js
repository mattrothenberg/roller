import React, { Component } from 'react';

class Error extends Component {
  render() {
    return(
      <div className="error flex items-center mt3 mb4 p1">
        <div className="icon-error flex-1 px1">
          <i className="fa fa-2x fa-exclamation-triangle"></i>
        </div>
        <h2 className="my0 px2 regular">
          { this.props.message }
        </h2>
      </div>
    );
  }
}

export default Error;
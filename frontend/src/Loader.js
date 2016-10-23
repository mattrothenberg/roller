import React, { Component } from 'react';

class Loader extends Component {
  render() {
    return(
      <div className="loader-wrap flex items-center justify-center fadeIn">
        <div className="loader is-loading">
          <span className="binary"></span>
          <span className="binary"></span>
          <span className="getting-there">Converting your Video</span>
        </div>
      </div>
    );
  }
}

export default Loader;
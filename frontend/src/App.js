import React, { Component } from 'react';
import logo from './logo.svg';
import './styles.scss';
import $ from 'jquery';

var Store = {

    listeners: [],

    url: '',
    start: '',
    end: '',
    getState: function() {
      return {
        url: this.url,
        start: this.start,
        end: this.end,
      }
    },

    dispatch: function(action) {
        switch(action.type) {
            case 'UPDATE_START':
                this.start = action.value;
                break;
            case 'UPDATE_END':
                this.end = action.value;
                break;
            case 'UPDATE_URL':
                this.url = action.value;
                break;
            case 'SUBMIT':
                console.log(this.getState())
                break;
        }

        var self = this;
        this.listeners.forEach(function(listener) { listener(self) });
    }
};

var Actions = {
  submit: (event) => {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:4567/stub',
      data: {
        url: Store.getState().url,
        start: Store.getState().start,
        end: Store.getState().end
      },
      success: (data) => {
        Store.dispatch({type: 'DATA_RECEIVED', data: data});
      }
    });
    Store.dispatch({type: 'SUBMIT'})
  },
  updateUrl: (event) => {
    Store.dispatch({type: 'UPDATE_URL', value: event.target.value})
  },
  updateStart: (event) => {
    Store.dispatch({type: 'UPDATE_START', value: event.target.value})
  },
  updateEnd: (event) => {
    Store.dispatch({type: 'UPDATE_END', value: event.target.value})
  }
};

class App extends Component {
  constructor() {
    super();

    this.state = Store.getState();
  }

  componentDidMount() {
    var self = this;
    Store.listeners.push(function(store) { self.setState(store.getState()); });
  }

  render() {
    return (
      <div className="App">
          <div><input value={this.state.url} onChange={Actions.updateUrl} type="text" name="url" placeholder="Enter Youtube Video URL"/></div>
          <div><input value={this.state.start} onChange={Actions.updateStart} type="text" name="start" placeholder="Enter Start Time"/></div>
          <div><input value={this.state.end} onChange={Actions.updateEnd} type="text" name="end" placeholder="Enter End Time"/></div>
          <button onClick={Actions.submit}>Convert to GIF</button>
      </div>
    );
  }

  postToBackend(stuff) {
      console.log(this);
      console.log(stuff);
  }
}

export default App;

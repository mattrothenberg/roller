import React, { Component } from 'react';
import logo from './logo.svg';
import './styles.scss';
import $ from 'jquery';
import YouTube from 'react-youtube';
import Nouislider from 'react-nouislider';


var Store = {

  listeners: [],

  url: '',
  start: 0,
  end: 100,
  getState: function () {
    return {
      url: this.url,
      start: this.start,
      end: this.end,
    }
  },

  dispatch: function (action) {
    switch (action.type) {
      case 'UPDATE_URL':
        this.url = action.value;
        break;
      case 'UPDATE_SLIDER':
        console.log(action);
        this.start = action.left;
        this.end = action.right;
        break;
      case 'SUBMIT':
        console.log(this.getState());
        break;
      default:
        return;
    }

    var self = this;
    this.listeners.forEach(function (listener) {
      listener(self)
    });
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
  updateSlider: (left, right) => {
    Store.dispatch({type: 'UPDATE_SLIDER', left: left, right: right })
  }
};

const opts = {
  height: '390',
  width: '640',
  playerVars: { // https://developers.google.com/youtube/player_parameters
    autoplay: 1
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = Store.getState();
  }

  onYouTubePlayerReady(event) {
    console.log(event.target);
  }

  componentDidMount() {
    var self = this;
    Store.listeners.push(function(store) { self.setState(store.getState()); });
  }

  sliderUpdated(event) {
    Actions.updateSlider(parseFloat(event[0]), parseFloat(event[1]));
    console.log(event);
  }

  render() {
    return (
      <div className="App">
        <div><input value={this.state.url} onChange={Actions.updateUrl} type="text" name="url" placeholder="Enter Youtube Video URL"/></div>
        <button onClick={Actions.submit}>Convert to GIF</button>
          <YouTube
            videoId="2g811Eo7K8U"
            opts={opts}
            onReady={this.onYouTubePlayerReady}
          />
        <Nouislider
          range={{min: 0, max: 100}}
          start={[this.state.start, this.state.end]}
          tooltips
          onChange={this.sliderUpdated}
        />
      </div>
    );
  }
}

export default App;

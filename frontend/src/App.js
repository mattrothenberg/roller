import React, { Component } from 'react';
import logo from './logo.svg';
import './styles.scss';
import $ from 'jquery';
import YouTube from 'react-youtube';
import Nouislider from 'react-nouislider';


var Store = {

  listeners: [],

  videoLength: 1,
  videoId: '',
  url: '',
  start: 0,
  end: 0,
  player: null,

  getState: function () {
    return {
      videoLength: this.videoLength,
      videoId: this.videoId,
      url: this.url,
      start: this.start,
      end: this.end,
      player: this.player
    }
  },

  dispatch: function (action) {
    switch (action.type) {
      case 'UPDATE_URL':
        this.url = action.value;
        this.videoId =
          this.url
            .substr(this.url.indexOf('?') + 1)
            .split('&')
            .filter(function(queryParam) { return queryParam.substr(0,2) === 'v='; })[0]
            .split('=')[1];
        break;

      case 'UPDATE_SLIDER':
        if(this.start != action.left) {
          this.player.seekTo(action.left);
        }
        this.start = action.left;
        this.end = action.right;

        break;

      case 'SUBMIT':
        console.log(this.getState());
        break;

      case 'YOUTUBE_PLAYER_READY':
        this.player = action.player;
        this.videoLength = this.player.getDuration();
        this.end = this.videoLength;

        break;

      case 'VIDEO_ENDED':
        this.player.seekTo(this.start);
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
  youtubePlayerReady: (player) => {
    Store.dispatch({type: 'YOUTUBE_PLAYER_READY', player: player})
  },
  submit: () => {
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
  },
  changePlayerState: (event) => {
    if(event.data === 0) {
      Store.dispatch({type: 'VIDEO_ENDED'});
    }
  }
};

const opts = {
  height: '390',
  width: '640',
  playerVars: { // https://developers.google.com/youtube/player_parameters
    autoplay: 0
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = Store.getState();
  }

  onYouTubePlayerReady(event) {
    Actions.youtubePlayerReady(event.target);
    // event.target
  }

  componentDidMount() {
    var self = this;
    Store.listeners.push(function(store) { self.setState(store.getState()); });
  }

  sliderUpdated(event) {
    Actions.updateSlider(parseFloat(event[0]), parseFloat(event[1]));
    console.log(event);
  }

  showPlayer() {
    return this.state.url ?
      <div>
        <YouTube
          className="mt3 mb4 yt-player"
          videoId={this.state.videoId}
          opts={{
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
              autoplay: 1,
              loop: 1,
              playlist: this.state.videoId,
              start: this.state.start,
              end: this.state.end
            }
          }}
          onReady={this.onYouTubePlayerReady}
          onStateChange={Actions.changePlayerState}
        />
      </div> :
      <h1>Please enter a video URL</h1>;
  }

  showSlider() {
    return this.state.player &&
      <div>
          <Nouislider
            range={{min: 0, max: this.state.videoLength}}
            start={[this.state.start, this.state.end]}
            step={1}
            tooltips
            onChange={this.sliderUpdated}
          />
          <button className="btn bg-blue white mt4" onClick={Actions.submit}>Convert to Gif</button>
        </div>
  }

  render() {
    return (
      <div className="max-width-3 mx-auto">
        <div className="px2 mt3">
          <div className="App">
            <input className="input" value={this.state.url} onChange={Actions.updateUrl} type="text" name="url" placeholder="Enter Youtube Video URL"/>
            { this.showPlayer() }
            { this.showSlider() }
          </div>
        </div>
      </div>
    );
  }
}

export default App;

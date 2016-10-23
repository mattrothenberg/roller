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
  gifUrl: null,

  getState: function () {
    return {
      videoLength: this.videoLength,
      videoId: this.videoId,
      url: this.url,
      start: this.start,
      end: this.end,
      player: this.player,
      gifUrl: this.gifUrl
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

      case 'YOUTUBE_PLAYER_READY':
        this.player = action.player;
        this.videoLength = this.player.getDuration();
        this.end = this.videoLength;

        break;

      case 'VIDEO_ENDED':
        this.player.seekTo(this.start);
        break;

      case 'DATA_RECEIVED':
        console.log(action.data);
        this.gifUrl = action.data.gif_url;
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
      url: '/convert',
      data: {
        video_id: Store.getState().videoId,
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
  height: '300',
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
      <div className="chrome-window mt3 mb4">
        <div className="chrome-header">
          <ul className="list-reset my0">
            <li className="inline-block mr1"><div className="dot close"></div></li>
            <li className="inline-block mr1"><div className="dot minimize"></div></li>
            <li className="inline-block mr1"><div className="dot maximize"></div></li>
          </ul>
        </div>
        <div className="chrome-body p1">
          <YouTube
            className="yt-player"
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
        </div>
      </div> :
      <div className="clearfix">
        <div className="sm-col-7">
          <h1 className="regular h4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat.
          </h1>
        </div>
      </div>
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
          <button className="btn bg-blue white mt3 right" onClick={Actions.submit}>Convert to Gif</button>
        </div>
  }

  showGif() {
    return this.state.gifUrl &&
      <img src={this.state.gifUrl} alt="GIF Brought To You By Roller"/>
  }

  render() {
    return (
      <div className="App">
        <div className="loader-wrap flex items-center justify-center">
          <div className="loader is-loading">
            <span className="binary"></span>
            <span className="binary"></span>
            <span className="getting-there">LOADING STUFF...</span>
          </div>
        </div>
        <div className="max-width-3 mx-auto">
          <nav className="px2 py2 center sm-left-align sm-flex items-center">
            <div className="flex-auto">
              <img className="logo mb1 mx-auto sm-mx0 sm-mb0" src={logo} alt="Roller"/>
            </div>
            <div className="navigation">
              <a className="text-decoration-none dark-blue link mr1 sm-mr3" href="#">GitHub</a>
              <a className="text-decoration-none dark-blue link mr1 sm-mr3" href="#">About</a>
            </div>
          </nav>
        </div>
        <div className="max-width-3 mx-auto">
          <div className="px2 mt1">
            <input className="input form-control" value={this.state.url} onChange={Actions.updateUrl} type="text" name="url" placeholder="Paste Youtube Video URL"/>
            { this.showPlayer() }
            { this.showSlider() }
            { this.showGif() }
          </div>
        </div>
      </div>
    );
  }
}

export default App;

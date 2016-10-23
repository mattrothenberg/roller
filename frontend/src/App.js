import React, { Component } from 'react';
import logo from './logo.svg';
import './styles.scss';
import $ from 'jquery';
import YouTube from 'react-youtube';
import Nouislider from 'react-nouislider';
import Loader from './Loader.js';
import ClipboardButton from 'react-clipboard.js';

const MAX_GIF_LENGTH = 15;
const MAX_VIDEO_LENGTH = 20 * 60;

var Store = {

  listeners: [],

  videoLength: 1,
  videoId: '',
  url: '',
  loading: false,
  start: 0,
  end: 0,
  player: null,
  gifUrl: '',

  getState: function () {
    return {
      videoLength: this.videoLength,
      videoId: this.videoId,
      url: this.url,
      loading: this.loading,
      start: this.start,
      end: this.end,
      player: this.player,
      gifUrl: this.gifUrl,
      validationErrors: {
        tooLong: this.end - this.start > MAX_GIF_LENGTH,
        videoTooLong: this.videoLength > MAX_VIDEO_LENGTH
      }
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
        this.gifUrl = action.data.gif_url;
        this.loading = false;
        break;

      case 'SUBMIT':
        this.loading = true;
        break;

      case 'RESET':
        this.gifUrl = '';
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
    Store.dispatch({type: 'SUBMIT'})
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
  },
  reset: () => {
    Store.dispatch({type: 'RESET'})
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
  }

  showPlayer() {
    return this.state.url ?
      <div className="chrome-window mt3 mb1">
        <div className="chrome-header">
          <ul className="list-reset my0">
            <li className="inline-block mr1"><div className="dot close"></div></li>
            <li className="inline-block mr1"><div className="dot minimize"></div></li>
            <li className="inline-block mr1"><div className="dot maximize"></div></li>
          </ul>
        </div>
        <div className="chrome-body p1 relative">
          { this.showLoader() }
          <YouTube
            className="yt-player"
            videoId={this.state.videoId}
            opts={{
              height: '390',
              width: '640',
              playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
                iv_load_policy: 3,
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
        <div className="col sm-col-7">
          <h1 className="regular h4 sm-h2">
            Roller allows you to easily isolate specific bits of YouTube videos – just the part you want to see – and then send the GIF as a link to your friends while preserving the element of surprise.
          </h1>
        </div>
      </div>
  }

  showSlider() {
    return this.state.player && !this.state.validationErrors.videoTooLong &&
      <div className="mt4">
          <Nouislider
            disabled={this.state.loading}
            range={{min: 0, max: this.state.videoLength}}
            start={[this.state.start, this.state.end]}
            step={1}
            connect={true}
            tooltips
            onChange={this.sliderUpdated}
          />
          <p className="mb0">
            {`Set the start and end points (max length is ${MAX_GIF_LENGTH} seconds).`}
          </p>
          <button
            className="btn bg-blue h3  white mt2 btn-submit right"
            disabled={this.state.loading || this.state.validationErrors.tooLong || this.state.validationErrors.videoTooLong}
            onClick={Actions.submit}>Convert to Gif</button>
        </div>
  }

  showGif() {
    return(
        <div className="max-width-4 mx-auto mt3">
          <div className="px2">
            <div className="clearfix mt2">
              <div className="col col-12 center">
                <figure className="gif-preview p1 m0">
                  <img src={this.state.gifUrl} alt="GIF Brought To You By Roller"/>
                </figure>
              </div>
            </div>
            <div className="form-group relative col-8 mx-auto mt2">
              <input type="text" className="input form-control" readOnly={true} value={this.state.gifUrl}/>
              <ClipboardButton className="btn-clipboard bg-blue white px2" data-clipboard-text={this.state.gifUrl} button-title="Copied!">
                Copy
              </ClipboardButton>
            </div>
            <div className="clearfix">
              <div className="col sm-col-12 center">
                <a
                  target="_blank"
                  href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(`Check out this gif I made using #roller (http://objectobject.2016.rubyrampage.com) ${this.state.gifUrl}`)}
                  className="btn bg-twitter white px2 inline-block mt1">
                  <i className="fa fa-twitter mr1"></i>
                  Share on Twitter
                </a>
                <button className="btn bg-pink h4 white mt1 inline-block sm-ml2" onClick={Actions.reset}>
                  Roll Another One
                </button>
              </div>
            </div>
          </div>
        </div>
    )
  }

  showLoader() {
    return this.state.loading && <Loader></Loader>;
  }

  render() {
    return (
      <div className="App">
        <div className="max-width-4 mx-auto">
          <nav className="px2 py2 center sm-left-align sm-flex items-center">
            <div className="flex-auto">
              <a href="/">
                <img className="logo mb1 mx-auto sm-mx0 sm-mb0 mt2" src={logo} alt="Roller"/>
              </a>

            </div>
            <div className="navigation">
              <a className="text-decoration-none dark-blue link mr1 sm-mr3" target="_blank" href="https://github.com/rumblex/rubyrampage2016-objectobject">
                <i className="fa fa-github mr1"></i>
                GitHub
              </a>
            </div>
          </nav>
        </div>
        { this.state.gifUrl ? this.showGif() : this.showSetupFlow() }
      </div>
    );
  }

  showSetupFlow() {
    return <div className="max-width-4 mx-auto">
      <div className="px2 mt1">
        <input autoFocus
               className="input form-control"
               disabled={this.state.loading}
               value={this.state.url}
               onChange={Actions.updateUrl}
               type="text"
               name="url"
               placeholder="Paste Youtube Video URL"/>
        { this.showPlayer() }
        { this.state.validationErrors.videoTooLong &&
          <div className="error flex items-center mt3 mb4 p1">
            <div className="icon-error flex-1 px1">
              <i className="fa fa-2x fa-exclamation-triangle"></i>
            </div>
            <h2 className="my0 px2 regular">We don't have enough hamsters to process videos that long! <br/> Please pick one 20 minutes or shorter.</h2>
          </div>
        }
        { this.showSlider() }
      </div>
    </div>
  }
}

export default App;

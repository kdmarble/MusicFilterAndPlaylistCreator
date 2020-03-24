import React from 'react';
import './App.css';
import LoadSongs from './LoadSongs.js';

const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
    }, {});
  
window.location.hash = "";

const redirect_uri = "http://localhost:3000/"
const scopes = [
    "playlist-read-collaborative",
    "playlist-modify-private",
    "playlist-modify-public",
    "playlist-read-private",
    "user-read-private"
]

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      token: null,
      authenticated: false,
      url: `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&redirect_uri=${redirect_uri}&scope=${scopes.join("%20")}&show_dialog=true`
    }
}

  componentDidMount() {
    let _token = hash.access_token;
    if (_token) {
        this.setState({token: _token, authenticated: true})
    }
  }

  render() {
    return (
      <div className="App">
        {!this.state.token && (
          <a href={this.state.url}>Load Songs</a>
        )}
        <LoadSongs token={this.state.token} authenticated={this.state.authenticated}/>
      </div>
    )
  }
}

export default App;

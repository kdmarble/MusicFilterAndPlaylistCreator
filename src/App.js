import React from 'react';
import './styles/App.css';
import LoadSongs from './components/LoadSongs.js';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';

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

const redirect_uri = "https://condescending-leavitt-bf574b.netlify.com"
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
      url: `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&redirect_uri=${redirect_uri}&scope=${scopes.join("%20")}&show_dialog=false`
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
        <Navbar className="navbar" expanded="sm" fixed="top" bg="dark" variant="dark">
          <Navbar.Brand>
          <img
            alt="Spotify Logo"
            src={require("./Spotify_Icon_RGB_Green.png")}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
            Music Filter and Playlist Creator
          </Navbar.Brand>
        </Navbar>
        <div>
          {!this.state.token && (
            <div className="copy">
              <h1>Music Filter and Playlist Creator</h1>
              <p>This app will allow you to get a list of up to 100 songs suggested from Spotify based on their musical attributes. You can adjust and filter these musical attributes to get the exact type and feeling of the songs right. Then, you can select whichever songs you like, and create a playlist of these songs.</p>
              <Button variant="success" size="lg" href={this.state.url} target="_parent" rel="noopener noreferrer">Sign in to Spotify</Button>
            </div>
          )}
        </div>
        {this.state.token && (
          <LoadSongs token={this.state.token} authenticated={this.state.authenticated}/>
        )}
      </div>
    )
  }
}

export default App;

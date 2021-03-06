import React from 'react';
import SongItem from './SongItem';
import CreatePlaylist from './CreatePlaylist';
import '../styles/LoadSongs.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

class LoadSongs extends React.Component {
    constructor(props) {
        super(props)
        this.loadSongs = this.loadSongs.bind(this);
        this.loadGenres = this.loadGenres.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.selectGenres = this.selectGenres.bind(this);
        this.selectTracks = this.selectTracks.bind(this);
        this.selectAllTracks = this.selectAllTracks.bind(this);
        this.state = {
            tracks: null,
            genre_limit: 5,
            seed_genres: [],
            genres: [],
            user_id: null,
            track_uris: [],
            formValues: {
                limit: 1,
                target_acousticness: 0.5,
                target_danceability: 0.5,
                target_energy: 0.5,
                target_instrumentalness: 0.1,
                target_liveness: 0.1,
                target_popularity: 100,
                target_speechiness: 0.5,
                target_tempo: 140,
                target_valence: 0.5
            }
        }
    }

    loadSongs(token) {
        if (this.state.seed_genres.length < 1) {
            alert("You must select at least one genre")
            return
        }

        fetch(`https://api.spotify.com/v1/recommendations?limit=${this.state.formValues["limit"]}&seed_genres=${this.state.seed_genres}&target_acousticness=${this.state.formValues["target_acousticness"]}&target_danceability=${this.state.formValues["target_danceability"]}&target_energy=${this.state.formValues["target_energy"]}&target_instrumentallness=${this.state.formValues["target_instrumentalness"]}&target_liveness=${this.state.formValues["target_liveness"]}&target_popularity=${this.state.formValues["target_popularity"]}&target_speechiness=${this.state.formValues["target_speechiness"]}&target_temp=${this.state.formValues["target_tempo"]}&target_valence=${this.state.formValues["target_valence"]}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            return response.json()
        }).then(data => {
            this.setState({tracks: data["tracks"]})
        })
    }

    loadGenres(token) {
        fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            return response.json()
        }).then(data=> {
            this.setState({genres: data["genres"]})
        })
    }

    loadUserID(token) {
        fetch("https://api.spotify.com/v1/me", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            return response.json()
        }).then(data => {
            this.setState({user_id: data["id"]})
        })
    }

    handleChange(event) {
        event.preventDefault()
        let formValues = this.state.formValues
        let name = event.target.name
        let value = event.target.value

        formValues[name] = value;

        this.setState({formValues})
    }

    selectGenres(event) {
        let isSelected = event.currentTarget.checked
        let value = event.target.value
        if (isSelected) {
            if(this.state.seed_genres.length < this.state.genre_limit) {
                this.setState({seed_genres: [...this.state.seed_genres, value]})
            }
        }
        else {
            this.setState({
                seed_genres: this.state.seed_genres.filter((item)=>value!==item)
            })
        }
    }

    selectTracks(event) {
        let isSelected = event.currentTarget.checked;
        let value = event.target.value
        if (isSelected) {
            this.setState({track_uris: [...this.state.track_uris, value]})
        }
        else {
            this.setState({
                track_uris: this.state.track_uris.filter((item)=>value!==item)
            })
        }
    }

    resetForm() {
        this.setState(state => {
            return {
                tracks: null,
                genre_limit: 5,
                seed_genres: [],
                genres: state.genres,
                user_id: state.user_id,
                track_uris: [],
                formValues: {
                    limit: 1,
                    target_acousticness: 0.5,
                    target_danceability: 0.5,
                    target_energy: 0.5,
                    target_instrumentalness: 0.1,
                    target_liveness: 0.1,
                    target_popularity: 100,
                    target_speechiness: 0.55,
                    target_tempo: 140,
                    target_valence: 0.5
                }
            }
        })
        let genreBoxes = document.querySelectorAll("input.genreCheck")
        genreBoxes.forEach(box => {
            box.checked = false
        })
    }

    selectAllTracks(event) {
        let isSelected = event.currentTarget.checked;
        let trackBoxes = document.querySelectorAll(".trackBox")
        let allTracks = []
        if (this.state.tracks) {
            if (isSelected) {
                this.state.tracks.forEach((track) => {
                    allTracks.push(track["uri"])
                })
                this.setState({track_uris: allTracks})
                trackBoxes.forEach((track) => {
                    track.checked = true;
                })
            } else {
                this.setState({track_uris: []})
                trackBoxes.forEach((track) => {
                    track.checked = false;
                })
            }
        }
    }

    componentDidMount() {
        this.loadGenres(this.props.token);
        this.loadUserID(this.props.token);
    }


    render() {
        return (
            <div className="LoadSongs">
                <Form>

                    <Form.Label as={Col}>
                        Number of songs:
                        <Form.Control size="sm" type="range" min="1" max="100" name="limit" value={this.state.formValues["limit"]} onChange={this.handleChange} />
                        {this.state.formValues["limit"]}
                    </Form.Label>
                    <br />
                    <br />
                    
                    <Form.Group>
                        <Form.Label as={Col}>
                            <Accordion>
                                <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="0">
                                Genres (Required Field. Only the first 5 checked will be accepted) <span className="arrow">&#x25BC;</span>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body className="genreList">
                                    {this.state.genres.map((genre) => {
                                        return (
                                            <React.Fragment key={genre}>
                                            <div>
                                            <input className="genreCheck" type="checkbox" onChange={this.selectGenres} value={genre} />
                                            <span>  </span>
                                            <Form.Label> {genre} </Form.Label>
                                            </div>
                                            </React.Fragment>
                                        )
                                    })}
                                    </Card.Body>
                                </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Form.Label>
                    </Form.Group>
                    <br />
                    <br />

                    <Form.Label as={Col}>
                        Acousticness (1 means track is acoustic): 
                        <Form.Control type="range" min="0.0" max="1.0" step="0.1" name="target_acousticness" value={this.state.formValues["target_acousticness"]} onChange={this.handleChange} />
                        {this.state.formValues["target_acousticness"]}
                    </Form.Label>
                    <br />
                    <br />

                    <Form.Label as={Col}>
                        Danceability: 
                        <Form.Control type="range" min="0.0" max="1.0" step="0.1" name="target_danceability" value={this.state.formValues["target_danceability"]} onChange={this.handleChange} />
                        {this.state.formValues["target_danceability"]}
                    </Form.Label>
                    <br />
                    <br />

                    <Form.Label as={Col}>
                        Energy: 
                        <Form.Control type="range" min="0.0" max="1.0" step="0.1" name="target_energy" value={this.state.formValues["target_energy"]} onChange={this.handleChange} />
                        {this.state.formValues["target_energy"]}
                    </Form.Label>
                    <br />
                    <br />

                    <Form.Label as={Col}>
                        Instrumentalness (values above 0.5 are intended to represent instrumental tracks): 
                        <Form.Control type="range" min="0.0" max="1.0" step="0.1" name="target_instrumentalness" value={this.state.formValues["target_instrumentalness"]} onChange={this.handleChange} />
                        {this.state.formValues["target_instrumentalness"]}
                    </Form.Label>
                    <br />
                    <br />

                    <Form.Label as={Col}>
                        Liveness (The odds a track is performed live or not): 
                        <Form.Control type="range" min="0.0" max="1.0" step="0.1" name="target_liveness" value={this.state.formValues["target_liveness"]} onChange={this.handleChange} />
                        {this.state.formValues["target_liveness"]}
                    </Form.Label>
                    <br />
                    <br />

                    <Form.Label as={Col}>
                        Popularity: 
                        <Form.Control type="range" min="0" max="100" name="target_popularity" value={this.state.formValues["target_popularity"]} onChange={this.handleChange} />
                        {this.state.formValues["target_popularity"]}
                    </Form.Label>
                    <br />
                    <br />

                    <Form.Label as={Col}>
                        Speechiness (A value greater than 0.6 describes mostly spoken word, rap lies between 0.3 and 0.6, and below 0.3 most likely represents music and other non-speech-like tracks): 
                        <Form.Control type="range" min="0.0" max="1.0" step="0.1" name="target_speechiness" value={this.state.formValues["target_speechiness"]} onChange={this.handleChange} />
                        {this.state.formValues["target_speechiness"]}
                    </Form.Label>
                    <br />
                    <br />

                    <Form.Label as={Col}>
                        Tempo: 
                        <Form.Control type="range" min="0" max="300" name="target_tempo" value={this.state.formValues["target_tempo"]} onChange={this.handleChange} />
                        {this.state.formValues["target_tempo"]}
                    </Form.Label>
                    <br />
                    <br />

                    <Form.Label as={Col}>
                        Valence (how happy the track sounds): 
                        <Form.Control type="range" min="0.0" max="1.0" step="0.1" name="target_valence" value={this.state.formValues["target_valence"]} onChange={this.handleChange} />
                        {this.state.formValues["target_valence"]}
                    </Form.Label>
                </Form>
    
                <div className="SongList">
                    <Button variant="outline-success" size="lg" onClick={ () => this.resetForm()}>Reset Form</Button>

                    <Button variant="success" size="lg" onClick={ () => this.loadSongs(this.props.token)}>Load Songs</Button>

                    <p>~~~~~~~~</p>
                    <p>Select songs to create a playlist</p>
                    <div className="SelectAllSongs">
                        <input type="checkbox" onChange={this.selectAllTracks} />
                        <Form.Label>Select All Songs</Form.Label>
                    </div>
                    <div className="SongResults">
                    {this.state.tracks && (
                        this.state.tracks.map((track) => {
                            return (
                                <React.Fragment key={track["uri"]}>
                                <input className="trackBox" type="checkbox" onChange={this.selectTracks} value={track["uri"]} />
                                <SongItem track={track} />
                                </React.Fragment>
                            )
                        })
                    )}
                    </div>

                    {this.state.track_uris.length > 0 && (
                        <CreatePlaylist  track_uris={this.state.track_uris} token={this.props.token} user_id={this.state.user_id}/>
                    )}
                    <p>~~~~~~~~</p>
                </div>

            </div>
        )
    }
}


export default LoadSongs;
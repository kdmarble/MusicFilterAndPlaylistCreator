import React from 'react';
import SongItem from './SongItem';
import { all } from 'q';

class LoadSongs extends React.Component {
    constructor(props) {
        super(props)
        this.loadSongs = this.loadSongs.bind(this);
        this.loadGenres = this.loadGenres.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.selectGenres = this.selectGenres.bind(this);
        this.state = {
            tracks: null,
            genre_limit: 5,
            seed_genres: [],
            genres: [],
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
    }

    loadSongs(token) {
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

    handleChange(event) {
        event.preventDefault()
        let formValues = this.state.formValues
        let name = event.target.name
        let value = event.target.value

        formValues[name] = value;

        this.setState({formValues})
    }

    selectGenres(event) {
        let isSelected = event.currentTarget.checked;
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

    componentDidMount() {
        this.loadGenres(this.props.token);
    }

    render() {
        return (
            <div>
                <form>
                    <label>
                        Limit:
                        <input type="range" min="1" max="100" name="limit" value={this.state.formValues["limit"]} onChange={this.handleChange} />
                        {this.state.formValues["limit"]}
                    </label>

                    <label>
                        Genres (Only the first 5 checked will be accepted):
                        {this.state.genres.map((genre) => {
                            return (
                                <>
                                <input type="checkbox" onChange={this.selectGenres} value={genre} />
                                <label>{genre}</label>
                                </>
                            )
                        })}

                    </label>

                    <label>
                        Acousticness (1 means track is acoustic): 
                        <input type="range" min="0.0" max="1.0" step="0.1" name="target_acousticness" value={this.state.formValues["target_acousticness"]} onChange={this.handleChange} />
                        {this.state.formValues["target_acousticness"]}
                    </label>

                    <label>
                        Danceability: 
                        <input type="range" min="0.0" max="1.0" step="0.1" name="target_danceability" value={this.state.formValues["target_danceability"]} onChange={this.handleChange} />
                        {this.state.formValues["target_danceability"]}
                    </label>

                    <label>
                        Energy: 
                        <input type="range" min="0.0" max="1.0" step="0.1" name="target_energy" value={this.state.formValues["target_energy"]} onChange={this.handleChange} />
                        {this.state.formValues["target_energy"]}
                    </label>

                    <label>
                        Instrumentalness (values above 0.5 are intended to represent instrumental tracks): 
                        <input type="range" min="0.0" max="1.0" step="0.1" name="target_instrumentalness" value={this.state.formValues["target_instrumentalness"]} onChange={this.handleChange} />
                        {this.state.formValues["target_instrumentalness"]}
                    </label>

                    <label>
                        Liveness (Whether a track is performed live or not): 
                        <input type="range" min="0.0" max="1.0" step="0.1" name="target_liveness" value={this.state.formValues["target_liveness"]} onChange={this.handleChange} />
                        {this.state.formValues["target_liveness"]}
                    </label>

                    <label>
                        Popularity: 
                        <input type="range" min="0" max="100" name="target_popularity" value={this.state.formValues["target_popularity"]} onChange={this.handleChange} />
                        {this.state.formValues["target_popularity"]}
                    </label>

                    <label>
                        Speechiness (A value greater than 0.6 describes mostly spoken word, rap lies between 0.3 and 0.6, and below 0.3 most likely represents music and other non-speech-like tracks): 
                        <input type="range" min="0.0" max="1.0" step="0.1" name="target_speechiness" value={this.state.formValues["target_speechiness"]} onChange={this.handleChange} />
                        {this.state.formValues["target_speechiness"]}
                    </label>

                    <label>
                        Tempo: 
                        <input type="range" min="0" max="200" name="target_tempo" value={this.state.formValues["target_tempo"]} onChange={this.handleChange} />
                        {this.state.formValues["target_tempo"]}
                    </label>

                    <label>
                        Valence (how happy the track sounds): 
                        <input type="range" min="0.0" max="1.0" step="0.1" name="target_valence" value={this.state.formValues["target_valence"]} onChange={this.handleChange} />
                        {this.state.formValues["target_valence"]}
                    </label>

                </form>

                <button onClick={ () => this.loadSongs(this.props.token)}>Load Songs</button>
                <p>~~~~~~~~</p>
                <div>
                {this.state.tracks && (
                    this.state.tracks.map((track) => {
                        return (
                        <SongItem track={track} />
                        )
                    })
                )}</div>
                <p>~~~~~~~~</p>


            </div>
        )
    }
}


export default LoadSongs;
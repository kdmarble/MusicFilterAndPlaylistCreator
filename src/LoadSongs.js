import React from 'react';

class LoadSongs extends React.Component {
    constructor(props) {
        super(props)
        this.loadSongs = this.loadSongs.bind(this);
        this.state = {
          response: null,
          tracks: null
        }
    }

    loadSongs(token) {
        fetch('https://api.spotify.com/v1/recommendations?seed_genres=pop', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            return response.json()
        }).then(data => {
            this.setState({response: data})
            this.setState({tracks: this.state.response.tracks})
        })

        // if (this.state.response !== null) {
        //     this.setState({
        //         tracks: this.state.response.tracks
        //     })
        // }
    }

    render() {
        return (
            <div>
                {this.props.authenticated && (
                    <button onClick={ () => this.loadSongs(this.props.token) }>Load Songs</button>
                )}
                <div>{this.state.tracks && (
                    <p>{this.state.tracks[0].name}</p>
                )}</div>
                <p>~~~~~~~~</p>
            </div>
        )
    }
}


export default LoadSongs;
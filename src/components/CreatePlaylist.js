import React from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import '../styles/CreatePlaylist.css'

class CreatePlaylist extends React.Component {
    constructor(props) {
        super(props)
        this.createPlaylist = this.createPlaylist.bind(this);
        this.state = {
            playlist_id: null,
            playlist_link: null,
            playlist_name: null
        }
    }

    createPlaylist() {
        let name
        if (this.state.playlist_name !== null) {
            name = this.state.playlist_name
        } else {
            name = "Your created playlist"
        }

        let createBody = {
            name: name,
            description: "Created using Music Filter and Playlist Creator"
        }

        fetch(`https://api.spotify.com/v1/users/${this.props.user_id}/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.props.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(createBody)
        }).then(response => {
            return response.json()
        }).then(data => {
            return this.setState({playlist_id: data["id"], playlist_link: data["external_urls"]["spotify"]})
        }).then(
            () => {
                return (
                    fetch(`https://api.spotify.com/v1/playlists/${this.state.playlist_id}/tracks`, {
                        method: "POST",
                        headers: {
                            'Authorization': `Bearer ${this.props.token}`,
                        },
                        body: JSON.stringify(this.props.track_uris)
                    })
                )
            }
        )
    }

    handleChange = (event) => {
        event.preventDefault()
        this.setState({playlist_name: event.target.value})
    }

    render() {
        return (
        <div className="CreatePlaylist">
            <InputGroup size="lg">
                <InputGroup.Prepend>
                <InputGroup.Text>Playlist Name</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl onChange={this.handleChange} aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
            </InputGroup>

            <Button variant="success" size="lg" onClick={ () => this.createPlaylist()}> Create Your Playlist! </Button>

            {this.state.playlist_link && (
                <Button variant="success" size="lg" href={this.state.playlist_link} target="_blank" rel="noopener noreferrer">Open Your Playlist in Spotify!</Button>
            )}
        </div>
        )
    }
}

export default CreatePlaylist

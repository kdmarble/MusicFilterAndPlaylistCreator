import React from 'react';
import Button from 'react-bootstrap/Button'
import '../styles/SongItem.css'

const SongItem = ({track}) => {
    return (
    <div className="SongItem">
        <img src={track["album"]["images"]["0"]["url"]} alt="album art"></img>
        <li key={track.id}>
        "{track.name}" by 
        {
            track.artists.map((artist) => {
                return ` ${artist.name}`
            }).join(",")
        }
        </li>
        <Button variant="success" size="sm" href={track.external_urls["spotify"]} target="_blank" rel="noopener noreferrer"> Open in Spotify </Button>
    </div>
    )
}

export default SongItem

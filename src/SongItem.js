import React from 'react';

const SongItem = ({track}) => {
    return (
    <li key={track.id}>
    {track.name} by 
    {
        track.artists.map((artist) => {
            return ` ${artist.name}`
        }).join(",")
    }
    <a href={track.external_urls["spotify"]} target="_blank" rel="noopener noreferrer">Open in Spotify</a>
    <iframe src={`https://open.spotify.com/embed/track/${track.id}`} width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media" title={track.id}></iframe>
    </li>
    )
}

export default SongItem

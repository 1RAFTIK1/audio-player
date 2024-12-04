import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText } from '@mui/material';
import { managePlaylists } from '../api';

const Playlist = () => {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await managePlaylists();
                setPlaylists(response.data);
            } catch (error) {
                alert('Error fetching playlists: ' + error.response.data);
            }
        };

        fetchPlaylists();
    }, []);

    return (
        <div>
            <Typography variant="h4">Your Playlists</Typography>
            <List>
                {playlists.map((playlist) => (
                    <ListItem key={playlist.id}>
                        <ListItemText primary={playlist.name} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Playlist;

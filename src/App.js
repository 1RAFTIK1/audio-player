import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import AudioPlayer from './components/AudioPlayer';
import Playlist from './components/Playlist';
import TrackUpload from './components/TrackUpload';
import { Container } from '@mui/material';

function App() {
    return (
        <Router>
            <Container>
                <Routes>
                    <Route path="/" exact component={Auth} />
                    <Route path="/upload" component={TrackUpload} />
                    <Route path="/playlists" component={Playlist} />
                    <Route path="/player" component={AudioPlayer} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;

import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { uploadTrack } from '../api';

const TrackUpload = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('track', file);
        formData.append('title', title);
        try {
            await uploadTrack(formData);
            alert('Track uploaded successfully!');
        } catch (error) {
            alert('Error: ' + error.response.data);
        }
    };

    return (
        <div>
            <Typography variant="h4">Upload Track</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Track Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input type="file" onChange={handleFileChange} />
                <Button type="submit" variant="contained" color="primary">
                    Upload
                </Button>
            </form>
        </div>
    );
};

export default TrackUpload;

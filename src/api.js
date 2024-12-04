import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const registerUser  = (user) => api.post('/register', user);
export const loginUser  = (user) => api.post('/login', user);
export const uploadTrack = (formData) => api.post('/upload', formData);
export const downloadTrack = (id) => api.get(`/download/${id}`, { responseType: 'blob' });
export const managePlaylists = () => api.get('/playlists');

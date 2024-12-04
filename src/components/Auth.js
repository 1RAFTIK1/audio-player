import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { registerUser , loginUser  } from '../api';

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { username, password };
        try {
            if (isLogin) {
                await loginUser (user);
                alert('Login successful!');
            } else {
                await registerUser (user);
                alert('Registration successful!');
            }
        } catch (error) {
            alert('Error: ' + error.response.data);
        }
    };

    return (
        <div>
            <Typography variant="h4">{isLogin ? 'Login' : 'Register'}</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                    {isLogin ? 'Login' : 'Register'}
                </Button>
                <Button onClick={() => setIsLogin(!isLogin)}>
                    Switch to {isLogin ? 'Register' : 'Login'}
                </Button>
            </form>
        </div>
    );
};

export default Auth;

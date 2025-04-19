// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; // Shared auth styles

const news_api_url = process.env.REACT_APP_API_URL;

function Login() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${news_api_url}/api/auth/login`, { email, password });

            // Store token and user details in localStorage
            localStorage.setItem('token', res.data.token);
            if (res.data.user) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
            }
            navigate('/');
            window.location.reload();
        } catch (error) {
            alert('Invalid credentials');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                    <div className="link-row">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;

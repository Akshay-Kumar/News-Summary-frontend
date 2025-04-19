// src/components/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // Make sure this is created for shared styles

const news_api_url = process.env.REACT_APP_API_URL;

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${news_api_url}/api/auth/forgot-password`, { email });
            setMessage(res.data.msg);
        } catch (error) {
            setMessage('Error sending password reset link');
            console.error('Forgot password error:', error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Send Reset Link</button>
                    {message && <p className="message">{message}</p>}
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;

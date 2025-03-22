// src/components/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
const news_api_url = process.env.REACT_APP_API_URL;
function ForgotPassword() {
    const [email, setEmail]       = useState('');
    const [message, setMessage]   = useState('');

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
        <div style={{ padding: '1rem' }}>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ margin: '0.5rem 0' }}>
                    <label>Enter your email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ForgotPassword;

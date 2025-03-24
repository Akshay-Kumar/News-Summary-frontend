// src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Remove the token from localStorage to log the user out
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optionally, if your backend supports a logout endpoint, you can call it here.
        // Then navigate to the login page.
        navigate('/login');
        window.location.reload();
    }, [navigate]);

    return (
        <div className="logout-container">
            <h2>You are being logged out...</h2>
        </div>
    );
}

export default Logout;

// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    // Retrieve the logged in user from localStorage
    let user = null
    if(!user){
        user = JSON.parse(localStorage.getItem('user'));
    }

    return (
        <nav style={{ padding: '1rem', background: '#eee' }}>
            <Link to="/">Top News</Link> |{' '}
            <Link to="/?category=technology">Technology</Link> |{' '}
            <Link to="/?category=politics">Politics</Link> |{' '}
            <Link to="/?category=entertainment">Entertainment</Link> |{' '}
            <Link to="/?category=sports">Sports</Link> |{' '}
            {user ? (
                <>
                    <span>Welcome, <b> {user.email} </b></span> |{' '}
                    <Link to="/bookmarks">Bookmarks</Link> |{' '}
                    <Link to="/logout">Logout</Link>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link> |{' '}
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;

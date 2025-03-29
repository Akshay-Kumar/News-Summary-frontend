import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Ensure the updated CSS is imported

function Navbar() {
    // Retrieve the logged in user from localStorage
    let user = null;
    if (!user) {
        user = JSON.parse(localStorage.getItem('user'));
    }

    const navigate = useNavigate();
    const [country, setCountry] = useState('');
    const [source, setSource] = useState('');

    // Update state when the dropdown selection changes
    const handleCountryChange = (e) => {
        setCountry(e.target.value);
        // Clear source selection if a country is chosen
        if (e.target.value) {
            setSource('');
        }
    };

    const handleSourceChange = (e) => {
        setSource(e.target.value);
        // Clear country selection if a source is chosen
        if (e.target.value) {
            setCountry('');
        }
    };

    // Build a query string and navigate on form submit
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        let queryString = '?';
        if (country) {
            queryString += `country=${country}&`;
        }
        if (source) {
            queryString += `source=${source}&`;
        }
        // Remove trailing '&' if present
        queryString = queryString.endsWith('&') ? queryString.slice(0, -1) : queryString;
        navigate(queryString);
    };

    return (
        <nav className="navbar">
            <div className="links">
                <Link to="/">Top News</Link>
                <Link to="/?category=technology">Technology</Link>
                <Link to="/?category=politics">Politics</Link>
                <Link to="/?category=entertainment">Entertainment</Link>
                <Link to="/?category=sports">Sports</Link>
            </div>
            <div className="filters">
                {/* Filter Dropdowns for Country and Source */}
                <form onSubmit={handleFilterSubmit} className="filter-form">
                    <select
                        className="custom-select"
                        value={country}
                        onChange={handleCountryChange}
                        disabled={source !== ''}
                    >
                        <option value="">Select Country</option>
                        <option value="us">United States</option>
                        <option value="gb">United Kingdom</option>
                        <option value="in">India</option>
                        <option value="ca">Canada</option>
                    </select>
                    <select
                        className="custom-select"
                        value={source}
                        onChange={handleSourceChange}
                        disabled={country !== ''}
                    >
                        <option value="">Select Source</option>
                        <option value="cnn">CNN</option>
                        <option value="bbc">BBC News</option>
                        <option value="theverge">The Verge</option>
                        <option value="techcrunch">TechCrunch</option>
                        <option value="nytimes">New York Times</option>
                        <option value="foxnews">Fox News</option>
                        <option value="ndtv">NDTV News</option>
                        <option value="cbc">CBC News</option>
                        <option value="reuters">Reuters</option>
                    </select>
                    <button type="submit" className="filter-btn">Filter</button>
                </form>
            </div>
            <div className="auth-links">
                {user ? (
                    <>
                        <span>Welcome, <b>{user.email}</b></span>
                        <Link to="/bookmarks">Bookmarks</Link>
                        <Link to="/logout">Logout</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;

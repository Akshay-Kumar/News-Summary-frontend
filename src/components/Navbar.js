import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const [country, setCountry] = useState('');
    const [source, setSource] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleCountryChange = (e) => setCountry(e.target.value);
    const handleSourceChange = (e) => setSource(e.target.value);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        let query = '?';
        if (country) query += `country=${country}&`;
        if (source) query += `source=${source}&`;
        navigate(query.endsWith('&') ? query.slice(0, -1) : query);
        setMenuOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="brand-and-toggle">
                    <span className="navbar-brand">NewsApp</span>
                    <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
                </div>

                <div className={`nav-sections ${menuOpen ? 'open' : ''}`}>
                    <div className="nav-links">
                        <Link to="/" onClick={closeMenu}>Top News</Link>
                        <Link to="/?category=technology" onClick={closeMenu}>Technology</Link>
                        <Link to="/?category=politics" onClick={closeMenu}>Politics</Link>
                        <Link to="/?category=entertainment" onClick={closeMenu}>Entertainment</Link>
                        <Link to="/?category=sports" onClick={closeMenu}>Sports</Link>
                        <Link to="/?category=business" onClick={closeMenu}>Business</Link>
                        <Link to="/?category=education" onClick={closeMenu}>Education</Link>
                        <Link to="/?category=health" onClick={closeMenu}>Health</Link>
                    </div>

                    <form className="filter-form" onSubmit={handleFilterSubmit}>
                        <select value={country} onChange={handleCountryChange} className="custom-select">
                            <option value="">Country</option>
                            <option value="us">USA</option>
                            <option value="gb">UK</option>
                            <option value="in">India</option>
                            <option value="ca">Canada</option>
                        </select>
                        <select value={source} onChange={handleSourceChange} className="custom-select">
                            <option value="">Source</option>
                            <option value="cnn">CNN</option>
                            <option value="bbc">BBC</option>
                            <option value="techcrunch">TechCrunch</option>
                        </select>
                        <button className="filter-btn" type="submit">Search</button>
                    </form>

                    <div className="auth-links">
                        {user ? (
                            <>
                                <span className="welcome">Hi, <b>{user.email}</b></span>
                                <Link to="/bookmarks" onClick={closeMenu}>Bookmarks</Link>
                                <Link to="/logout" onClick={closeMenu}>Logout</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMenu}>Login</Link>
                                <Link to="/register" onClick={closeMenu}>Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

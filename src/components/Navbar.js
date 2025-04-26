import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const [country, setCountry] = useState('');
    const [source, setSource] = useState('');
    const [user, setUser] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [countries, setCountries] = useState([]);
    const [sources, setSources] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                setUser(user);
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchDropdownData() {
            try {
                const response = await fetch('/dropdown-data.xml');
                const text = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, "application/xml");

                const countryElements = xml.getElementsByTagName('country');
                const sourceElements = xml.getElementsByTagName('source');

                const countriesArray = Array.from(countryElements).map(c => ({
                    code: c.getAttribute('code'),
                    name: c.textContent
                }));

                const sourcesArray = Array.from(sourceElements).map(s => ({
                    code: s.getAttribute('code'),
                    name: s.textContent
                }));

                setCountries(countriesArray);
                setSources(sourcesArray);

            } catch (error) {
                console.error('Error loading dropdown data:', error);
            }
        }
        fetchDropdownData();
    }, []);

    const handleCountryChange = (e) => setCountry(e.target.value);
    const handleSourceChange = (e) => setSource(e.target.value);

    const handleBrandClick = () => {
        setMenuOpen(false);
        navigate('/');
    };

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
                    <div className="navbar-brand" onClick={handleBrandClick} style={{ cursor: 'pointer' }}>
                        News Summary
                    </div>
                    <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
                </div>

                <div className={`nav-sections ${menuOpen ? 'open' : ''}`}>
                    <div className="nav-links">
                        {/* Keep your hardcoded links if you want */}
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
                            {countries.map((c, idx) => (
                                <option key={idx} value={c.code}>{c.name}</option>
                            ))}
                        </select>
                        <select value={source} onChange={handleSourceChange} className="custom-select">
                            <option value="">Source</option>
                            {sources.map((s, idx) => (
                                <option key={idx} value={s.code}>{s.name}</option>
                            ))}
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

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
    const [links, setLinks] = useState([]);
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

    useEffect(() => {
        async function fetchLinks() {
            try {
                const response = await fetch('/links.xml');
                const text = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, "application/xml");

                const linkElements = xml.getElementsByTagName('link');
                const linksArray = Array.from(linkElements).map(link => ({
                    name: link.getElementsByTagName('name')[0].textContent,
                    path: link.getElementsByTagName('path')[0].textContent,
                }));

                setLinks(linksArray);
            } catch (error) {
                console.error('Error loading links:', error);
            }
        }

        fetchLinks();
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
                        {links.map((link, idx) => (
                            <Link key={idx} to={link.path} onClick={closeMenu}>
                                {link.name}
                            </Link>
                        ))}
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

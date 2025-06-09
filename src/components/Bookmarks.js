import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Bookmarks.css'; // Import the CSS file

const news_api_url = process.env.REACT_APP_API_URL;

function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        async function fetchBookmarks() {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await axios.get(`${news_api_url}/api/bookmarks`, {
                    headers: { 'x-auth-token': token }
                });
                setBookmarks(res.data);
            } catch (error) {
                console.error('Error fetching bookmarks:', error);
            }
        }
        fetchBookmarks();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${news_api_url}/api/bookmarks/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setBookmarks(bookmarks.filter((bookmark) => bookmark._id !== id));
        } catch (error) {
            console.error('Error deleting bookmark:', error);
        }
    };

    return (
        <div className="bookmarks-container">
            <h2>Your Bookmarks</h2>
            {bookmarks.length === 0 ? (
                <p>No bookmarks available.</p>
            ) : (
                bookmarks.map((bookmark) => (
                    <div key={bookmark._id} className="bookmark-item">
                        <h3>{bookmark.article.title}</h3>
                        <p>{bookmark.article.description}</p>
                        <a href={bookmark.article.url} target="_blank" rel="noopener noreferrer">
                            Read More
                        </a>
                        <br />
                        <button onClick={() => handleDelete(bookmark._id)}>Remove Bookmark</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default Bookmarks;

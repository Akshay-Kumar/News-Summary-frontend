// src/components/NewsItem.js
import React from 'react';
import axios from 'axios';
const news_api_url = process.env.REACT_APP_API_URL;
function NewsItem({ article }) {
    const handleBookmark = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to bookmark articles');
            return;
        }
        try {
            await axios.post(
                `${news_api_url}/api/bookmarks`,
                { article },
                { headers: { 'x-auth-token': token } }
            );
            alert('Article bookmarked!');
        } catch (error) {
            console.error('Bookmark error:', error);
            alert('Error bookmarking article');
        }
    };

    return (
        <div style={{ border: '1px solid gray', padding: '1rem', margin: '1rem 0' }}>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read More
            </a>
            <br />
            <button onClick={handleBookmark}>Bookmark</button>
        </div>
    );
}

export default NewsItem;

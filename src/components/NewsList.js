// src/components/NewsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem';
import { useLocation } from 'react-router-dom';
const news_api_url = process.env.REACT_APP_API_URL;
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function NewsList() {
    const [articles, setArticles] = useState([]);
    const query = useQuery();
    const category = query.get('category') || 'general';

    useEffect(() => {
        async function fetchNews() {
            try {
                // Adjust the backend URL if needed
                const res = await axios.get(`${news_api_url}/api/news?category=${category}`);
                setArticles(res.data);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        }
        fetchNews();
    }, [category]);

    return (
        <div style={{ padding: '1rem' }}>
            <h1>{category.charAt(0).toUpperCase() + category.slice(1)} News</h1>
            {articles.length === 0 ? (
                <p>No articles available.</p>
            ) : (
                articles.map((article, index) => (
                    <NewsItem key={index} article={article} />
                ))
            )}
        </div>
    );
}

export default NewsList;

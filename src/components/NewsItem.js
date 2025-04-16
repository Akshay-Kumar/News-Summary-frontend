// src/components/NewsItem.js
import React, { useState } from 'react';
import axios from 'axios';
import ArticleCard from './ArticleCard';
import ArticleModal from './ArticleModal';

const news_api_url = process.env.REACT_APP_API_URL;

function NewsItem({ article }) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleReadMore = () => {
        setShowModal(true);
    };

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
            setIsBookmarked(true);
            alert('Article bookmarked!');
        } catch (error) {
            console.error('Bookmark error:', error);
            alert('Error bookmarking article');
        }
    };

    const handleReadFullArticle = (link) => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="news-container">
            <ArticleCard
                key={article.id}
                image={article.urlToImage}
                title={article.title}
                summary={article.summary}
                onReadMore={handleReadMore}
                onBookmark={handleBookmark}
                bookmarked={isBookmarked}
            />
            {showModal && (
                <ArticleModal
                    article={article}
                    onClose={() => setShowModal(false)}
                    onReadFullArticle={() => handleReadFullArticle(article.url)}
                />
            )}
        </div>
    );
}

export default NewsItem;

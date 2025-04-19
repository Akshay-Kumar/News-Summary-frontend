import React from 'react';
import './ArticleCard.css'; // Ensure the correct path

const ArticleCard = ({
                         image,
                         title,
                         summary,
                         onReadMore,
                         onBookmark,
                         bookmarked,
                     }) => {
    return (
        <div className="article-card" onClick={onReadMore}>
            {image && <img className="article-image" src={image} alt={title} />}
            <div className="article-content">
                <div className="header">
                    <h2 className="article-title">{title}</h2>
                </div>
                <p className="article-summary">{summary}</p>
                <div className="button-container">
                    {/*
                        <button className="read-more" onClick={onReadMore}>
                            Read More
                        </button>
                    */}
                    <button className="bookmark-btn" onClick={onBookmark}>
                        {bookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;

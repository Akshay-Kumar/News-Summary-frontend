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
        <div className="article-card">
            {image && <img className="article-image" src={image} alt={title} />}
            <div className="article-content">
                <div className="header">
                    <h2 className="article-title">{title}</h2>
                    <button className="bookmark-btn" onClick={onBookmark}>
                        {bookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                </div>
                <p className="article-summary">{summary}</p>
                <button className="read-more" onClick={onReadMore}>
                    Read More
                </button>
            </div>
        </div>
    );
};

export default ArticleCard;

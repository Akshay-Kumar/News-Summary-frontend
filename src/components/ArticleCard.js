import React from 'react';
import './ArticleCard.css'; // Ensure the correct path

const ArticleCard = ({
                         image,
                         title,
                         summary,
                         onReadMore,
                         onBookmark,
                         bookmarked,
                         sourceName,
                         sourceIcon
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
                    {/* --- Source Info Block --- */}
                    {(sourceName || sourceIcon) && (
                        <div className="source-info" onClick={(e) => e.stopPropagation()}>
                            {sourceIcon && (
                                <img src={sourceIcon} alt={sourceName} className="source-icon" />
                            )}
                            {sourceName && <span className="source-name">{sourceName}</span>}
                        </div>
                    )}
                    {/* --- Source Info Block --- */}
                    <button className="bookmark-btn" onClick={
                        (e) => {
                            e.stopPropagation(); // 👈 Prevent modal open
                            onBookmark();
                        }
                    }>
                        {bookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;

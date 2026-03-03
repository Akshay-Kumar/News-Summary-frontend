// src/components/ArticleCard.js
import React from 'react';
import './ArticleCard.css';

const ArticleCard = ({
                         image,
                         title,
                         summary,
                         onReadMore,
                         onBookmark,
                         bookmarked,
                         sourceName,
                         sourceIcon,
                         publishedAt,
                         hideBookmark,
                         bottomRightButtons
                     }) => {
    return (
        <div className="article-card" onClick={onReadMore}>
            {image && <img className="article-image" src={image} alt={title} />}
            <div className="article-content">
                <div className="header">
                    <h2 className="article-title">{title}</h2>
                </div>
                {publishedAt && (
                    <p className="article-date">
                        {new Date(publishedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </p>
                )}
                <p className="article-summary">{summary}</p>
                <div className="button-container">
                    {(sourceName || sourceIcon) && (
                        <div className="source-info" onClick={(e) => e.stopPropagation()}>
                            {sourceIcon && (
                                <img src={sourceIcon} alt={sourceName} className="source-icon" />
                            )}
                            {sourceName && <span className="source-name">{sourceName}</span>}
                        </div>
                    )}
                    {!hideBookmark && (
                        <button
                            className="bookmark-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onBookmark();
                            }}
                        >
                            {bookmarked ? 'Bookmarked' : 'Bookmark'}
                        </button>
                    )}
                </div>

                {/* Render bottomRightButtons in a container */}
                {bottomRightButtons && (
                    <div className="bottom-buttons">
                        {bottomRightButtons}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleCard;

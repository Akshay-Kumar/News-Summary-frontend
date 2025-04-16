// src/components/ArticleModal.js
import React from 'react';
import './ArticleModal.css';

function ArticleModal({ article, onClose, onReadFullArticle }) {
    if (!article) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <h2>{article.title}</h2>
                <img src={article.urlToImage} alt={article.title} />
                <p>{article.summary || article.content}</p>
                <div className="modal-actions">
                    <button onClick={onReadFullArticle} className="modal-button">
                        Read full article
                    </button>
                    <button onClick={onClose} className="modal-button">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ArticleModal;

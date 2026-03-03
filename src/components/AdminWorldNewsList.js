// src/components/AdminWorldNewsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import './ArticleCard.css';
import ArticleModal from "./ArticleModal";
import { Link } from 'react-router-dom';
import Spinner from './Spinner';

const news_api_url = process.env.REACT_APP_API_URL;

function AdminWorldNewsList() {
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editSummary, setEditSummary] = useState('');
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageInput, setPageInput] = useState("1");
    const csvFileName = `worldnews_articles_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const userRole = user?.role;
        if (!token || userRole !== 'admin') {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        fetchAdminNews();
    }, [page, search]);

    useEffect(() => {
        setPageInput(String(page)); // keep input in sync when user clicks Prev/Next
    }, [page]);

    const clampPage = (p) => Math.min(Math.max(p, 1), totalPages || 1);

    const goToPage = () => {
        const n = parseInt(pageInput, 10);
        if (Number.isNaN(n)) return;
        setPage(clampPage(n));
    };

    async function fetchAdminNews() {
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const res = await axios.get(
                `${news_api_url}/api/worldnews_admin?page=${page}&search=${search}`,
                { headers: { 'x-auth-token': token } }
            );
            setArticles(res.data.articles);
            setTotalPages(res.data.pages || 1); // fallback to 1 if undefined
        } catch (error) {
            console.error('Error fetching admin news:', error);
            setError(`Error fetching admin news: ${error}`);
            if (error.response && error.response.status === 403) {
                alert('Access denied. Admins only.');
                navigate('/login');
            }
        }
        finally {
            setLoading(false);
        }
    }

    async function handleDelete(articleId) {
        const token = localStorage.getItem('token');
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        try {
            await axios.delete(`${news_api_url}/api/worldnews_admin/${articleId}`, {
                headers: { 'x-auth-token': token }
            });
            fetchAdminNews();
        } catch (error) {
            console.error('Error deleting article:', error);
            setError(`Error deleting article: ${error}`);
            alert('Error deleting article');
        }
    }

    function handleEdit(article) {
        setEditId(article._id);
        setEditTitle(article.title);
        setEditSummary(article.summary || '');
    }

    async function handleSave(articleId) {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `${news_api_url}/api/worldnews_admin/${articleId}`,
                {
                    title: editTitle,
                    summary: editSummary,
                },
                { headers: { 'x-auth-token': token } }
            );
            setEditId(null);
            setEditTitle('');
            setEditSummary('');
            fetchAdminNews();
        } catch (error) {
            console.error('Error updating article:', error);
            setError(`Error updating article: ${error}`);
            alert('Error updating article');
        }
    }

    const handleReadMore = (article) => {
        setSelectedArticle(article);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedArticle(null);
    };

    const handleReadFullArticle = (url) => {
        window.open(url, '_blank');
    };
    if(loading) return <Spinner/>;
    if(error) return <div className="error-msg">{error}</div>
    return (
        <div style={{ padding: '1rem' }}>
            <h1>Admin - World News Articles</h1>

            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search title..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    style={{
                        padding: '0.5rem',
                        width: '250px'
                    }}
                />
                <CSVLink
                    data={articles}
                    filename={csvFileName}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontSize: '0.9rem'
                    }}
                >
                    Export CSV
                </CSVLink>
                <Link
                    to="/admin_job_dashboard"
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontSize: '0.9rem'
                    }}
                >
                    Job Dashboard
                </Link>
            </div>

            {articles.length === 0 ? (
                <p>No articles found.</p>
            ) : (
                articles.map((article) => (
                    <ArticleCard
                        key={article._id}
                        image={article.urlToImage}
                        publishedAt={article.publishedAt}
                        title={
                            editId === article._id ? (
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    style={{
                                        padding: '0.5rem',
                                        width: '80%',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : article.title
                        }
                        summary={
                            editId === article._id ? (
                                <textarea
                                    value={editSummary}
                                    onChange={(e) => setEditSummary(e.target.value)}
                                    style={{
                                        padding: '0.5rem',
                                        width: '80%',
                                        height: '80px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : article.summary
                        }
                        sourceName={article.source_name}
                        sourceIcon={article.source_icon}
                        onReadMore={() => handleReadMore(article)}
                        hideBookmark={true}
                        bottomRightButtons={
                            editId === article._id ? (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSave(article._id);
                                        }}
                                        className="bookmark-btn"
                                        style={{
                                            backgroundColor: 'green',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditId(null);
                                            setEditTitle('');
                                            setEditSummary('');
                                        }}
                                        className="bookmark-btn"
                                        style={{
                                            backgroundColor: '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(article);
                                        }}
                                        className="bookmark-btn"
                                        style={{
                                            backgroundColor: 'green',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(article._id);
                                        }}
                                        className="bookmark-btn"
                                        style={{
                                            backgroundColor: 'red',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )
                        }
                    />
                ))
            )}

            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="bookmark-btn"
                    style={{ padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                >
                    Prev
                </button>

                <span>Page {page} of {totalPages || 1}</span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="bookmark-btn"
                    style={{ padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                >
                    Next
                </button>

                {/* Go to page */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Go to</span>
                    <input
                        type="number"
                        min={1}
                        max={totalPages || 1}
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") goToPage();
                        }}
                        style={{ width: '90px', padding: '0.35rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button
                        onClick={goToPage}
                        className="bookmark-btn"
                        style={{ padding: '0.3rem 0.8rem', borderRadius: '4px' }}
                        disabled={!pageInput || Number.isNaN(parseInt(pageInput, 10))}
                    >
                        Go
                    </button>
                </div>
            </div>

            {showModal && selectedArticle && (
                <ArticleModal
                    article={selectedArticle}
                    onClose={handleCloseModal}
                    onReadFullArticle={() => handleReadFullArticle(selectedArticle.url)}
                />
            )}
        </div>
    );
}

export default AdminWorldNewsList;

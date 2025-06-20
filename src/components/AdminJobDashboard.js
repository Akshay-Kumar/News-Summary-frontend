import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminJobDashboard.css';

export default function AdminJobDashboard() {
    const [jobStatus, setJobStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [jobHistory, setJobHistory] = useState([]);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/jobs/history`, {
                headers: { 'x-auth-token': token }
            });
            setJobHistory(res.data);
        } catch {
            setError('Failed to fetch job history');
        }
    };

    const fetchStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/jobs`, {
                headers: { 'x-auth-token': token }
            });
            setJobStatus(res.data);
        } catch (err) {
            setError('Failed to fetch job status');
        }
    };

    const handleRunJob = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/jobs/run`, {}, {
                headers: { 'x-auth-token': token }
            });
        } catch (err) {
            if (err.response?.status === 429) {
                setError('Job is already running.');
            } else {
                setError('Failed to trigger job');
            }
        } finally {
            setLoading(false);
            fetchStatus();
            fetchHistory();
        }
    };

    useEffect(() => {
        fetchStatus();
        fetchHistory();
        const interval = setInterval(() => {
            fetchStatus();
            fetchHistory();
        }, 1000); // every 1 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="admin-page-container">
            <h1 className="page-title">News Refresh Job Dashboard</h1>

            {error && <p className="error-text">{error}</p>}

            {jobStatus ? (
                <div className="job-info">
                    <p><strong>Status:</strong> {jobStatus.status}</p>
                    <p><strong>Start Time:</strong> {jobStatus.startTime ? new Date(jobStatus.startTime).toLocaleString() : 'N/A'}</p>
                    <p><strong>End Time:</strong> {jobStatus.endTime ? new Date(jobStatus.endTime).toLocaleString() : 'Running'}</p>
                    <p><strong>Run Type:</strong> {jobStatus.runType}</p>
                    <p><strong>Articles Fetched:</strong> {jobStatus.fetchedCount ?? 'N/A'}</p>
                    {jobStatus.error && (
                        <p className="error-text">
                            <strong>Error:</strong> {jobStatus.error}
                        </p>
                    )}
                    {jobStatus.info && (
                        <p className="info-text">
                            <strong>Info:</strong> {jobStatus.info}
                        </p>
                    )}
                    {/* jobStatus.status === 'running' */ jobStatus && (
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${jobStatus.progress || 0}%` }} />
                            <p>{jobStatus.progress || 0}%</p>
                        </div>
                    )}
                </div>
            ) : (
                <p>No job data available.</p>
            )}

            <div className="action-row">
                <button
                    className="primary-button"
                    onClick={handleRunJob}
                    disabled={loading || (jobStatus && jobStatus.status === 'running')}
                >
                    {loading ? 'Processing...' : 'Run Now'}
                </button>
            </div>

            <div className="job-history">
                <h2>Job History</h2>
                {jobHistory.length === 0 ? (
                    <p>No history available.</p>
                ) : (
                    <table className="history-table">
                        <thead>
                        <tr>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Status</th>
                            <th>Run Type</th>
                            <th>Fetched</th>
                            <th>Error</th>
                        </tr>
                        </thead>
                        <tbody>
                        {jobHistory.map((job, index) => (
                            <tr key={index}>
                                <td>{job.startTime ? new Date(job.startTime).toLocaleString() : 'N/A'}</td>
                                <td>{job.endTime ? new Date(job.endTime).toLocaleString() : 'N/A'}</td>
                                <td>{job.status}</td>
                                <td>{job.runType}</td>
                                <td>{job.fetchedCount ?? 'N/A'}</td>
                                <td className="history-error">{job.error || '-'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

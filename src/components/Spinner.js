import React from 'react';
import './Spinner.css'; // Optional, for styling

const Spinner = () => {
    return (
        <div className="spinner-container">
            <div className="spinner" />
            <p>Loading news...</p>
        </div>
    );
};

export default Spinner;

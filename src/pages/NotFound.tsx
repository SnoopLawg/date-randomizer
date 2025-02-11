import React from 'react';

const NotFound: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <button
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    borderRadius: '5px',
                    backgroundColor: '#6C757D',
                    color: '#FFF',
                    border: 'none',
                    cursor: 'pointer'
                }}
                onClick={() => window.location.href = '/'}
            >
                Home
            </button>
        </div>
    );
};

export default NotFound;
import React from 'react';

const Loader = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            minHeight: '200px', // Ensure visibility
            fontSize: '18px',
            fontWeight: '500',
            color: '#555'
        }}>
            Loading...
        </div>
    );
};

export default Loader;

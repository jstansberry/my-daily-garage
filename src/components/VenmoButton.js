'use client';

import React from 'react';

const VenmoButton = () => {
    // TODO: Replace with your actual Venmo username
    const venmoUsername = 'dropout86';

    return (
        <a
            href={`https://venmo.com/u/${venmoUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.button}
            title="Support us on Venmo"
        >
            <span style={styles.icon}>V</span>
            <span className="venmo-text">Support</span>
        </a>
    );
};

const styles = {
    button: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#3d95ce', // Venmo blueish
        color: 'white',
        padding: '4px 10px',
        borderRadius: '10px',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        marginRight: '10px',
        transition: 'opacity 0.2s',
        border: '1px solid rgba(255,255,255,0.2)'
    },
    icon: {
        fontSize: '1rem',
        fontStyle: 'italic',
        fontWeight: '900'
    }
};

export default VenmoButton;

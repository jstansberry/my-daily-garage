'use client';

import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConcent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConcent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <p style={styles.text}>
                    We use cookies to enhance your experience and purely for Google AdSense integration.
                    By continuing to visit this site you agree to our use of cookies.
                </p>
                <button onClick={handleAccept} style={styles.button}>
                    Got it
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderTop: '1px solid #333',
        padding: '15px 20px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center'
    },
    content: {
        maxWidth: '1000px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
    },
    text: {
        color: '#fff',
        margin: 0,
        fontSize: '0.9rem',
        lineHeight: '1.4'
    },
    button: {
        backgroundColor: '#4a9eff',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        padding: '8px 20px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        whiteSpace: 'nowrap'
    }
};

export default CookieConsent;

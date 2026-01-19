import React from 'react';

const GameLayout = ({ children, title }) => {
    return (
        <div style={styles.container}>
            <div style={styles.content}>
                {children}
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        textAlign: 'center',
        fontSize: '2rem',
        color: '#000',
    },
    content: {
        width: '100%',
    }
};

export default GameLayout;

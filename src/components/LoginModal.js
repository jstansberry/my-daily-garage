import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginModal = ({ onClose }) => {
    const { loginWithGoogle, loginWithDiscord } = useAuth();

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <button style={styles.closeButton} onClick={onClose}>&times;</button>

                <h2 style={styles.header}>Sign In</h2>

                <div style={styles.buttonContainer}>
                    {/* Google Button */}
                    <button
                        onClick={() => { loginWithGoogle(); onClose(); }}
                        className="login-provider-btn login-provider-btn-google"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" style={styles.icon}>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Sign in with Google</span>
                    </button>

                    {/* Discord Button */}
                    <button
                        onClick={() => { loginWithDiscord(); onClose(); }}
                        className="login-provider-btn login-provider-btn-discord"
                    >
                        <svg viewBox="0 0 127.14 96.36" width="24" height="18" style={styles.icon}>
                            <path fill="#5865F2" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22c1.24-23.28-5.83-47.5-23.2-71.8C103.22,8.42,107.7,8.07,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                        </svg>
                        <span>Sign in with Discord</span>
                    </button>

                    <button
                        style={{ ...styles.loginButton, backgroundColor: '#E1306C' }}
                        disabled
                        title="Coming Soon"
                    >
                        Login with Instagram
                    </button>

                    <button
                        style={{ ...styles.loginButton, backgroundColor: '#000000' }}
                        disabled
                        title="Coming Soon"
                    >
                        Login with Apple
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(5px)'
    },
    modal: {
        backgroundColor: '#1a1a1a',
        padding: '40px 30px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px', // Detailed narrower width for login
        position: 'relative',
        color: '#fff',
        border: '1px solid #333',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '15px',
        background: 'none',
        border: 'none',
        color: '#050505ff',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '5px',
        lineHeight: 1
    },
    header: {
        marginTop: 0,
        marginBottom: '30px',
        color: '#fff',
        fontSize: '1.8rem'
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%'
    },
    // Common Base for coming soon buttons
    loginButton: {
        width: '100%',
        padding: '12px',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'default', // Since they are disabled
        opacity: 0.7,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    icon: {
        display: 'block'
    }
};

export default LoginModal;

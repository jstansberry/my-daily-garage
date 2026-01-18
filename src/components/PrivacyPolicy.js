import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div style={styles.container} className="glass-panel">
            <h1 style={styles.title}>Privacy Policy</h1>
            <p style={styles.date}>Last Updated: January 18, 2026</p>

            <section style={styles.section}>
                <h2 style={styles.heading}>1. Introduction</h2>
                <p>Welcome to My Daily Garage. We value your privacy and are committed to protecting your personal data.</p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>2. Data We Collect</h2>
                <p>We only collect information necessary to provide you with the best gaming experience. This includes:</p>
                <ul>
                    <li><b>Identity Data:</b> When you sign in with Google, we receive your name and email address.</li>
                    <li><b>Game Progress:</b> We store your daily guesses and scores to provide leaderboards and history.</li>
                </ul>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>3. How We Use Your Data</h2>
                <p>We use your data strictly for:</p>
                <ul>
                    <li>Authenticating your session via Google Login.</li>
                    <li>Saving and displaying your daily game progress.</li>
                    <li>Generating the Grand Prix Leaderboard.</li>
                </ul>
                <p>We do <b>not</b> sell your data to third parties. However, we may share anonymized data with advertising partners as described below.</p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>4. Cookies and Tracking Technologies</h2>
                <p>We use cookies to enhance your experience. Specifically:</p>
                <ul>
                    <li><b>Essential Cookies:</b> Required for login and game functionality.</li>
                    <li><b>Analytics & Advertising Cookies:</b> Used by Google AdSense and analytics tools to understand site usage and show relevant ads.</li>
                </ul>
                <p>You can choose to disable cookies through your browser settings, though this may affect your ability to save game progress.</p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>5. Google AdSense & Third-Party Vendors</h2>
                <p>We use Google AdSense to display advertisements. Google and its partners use cookies (such as the DoubleClick cookie) to serve ads based on your prior visits to our website or other websites on the Internet.</p>
                <p>You may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>6. Third-Party Services</h2>
                <p>We use the following third-party services:</p>
                <ul>
                    <li><b>Supabase:</b> For database storage and authentication management.</li>
                    <li><b>Google:</b> For identity verification (Google Login) and Advertising (AdSense).</li>
                </ul>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>7. CCPA & GDPR Rights</h2>
                <p>Residents of California (CCPA) and the EU (GDPR) have the right to access, rectify, or delete their personal data. We retain your game scores and progress as long as your account is active. You may request data deletion at any time by contacting us.</p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>6. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at support@mydailygarage.com.</p>
            </section>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '40px auto',
        padding: '30px',
        color: '#000',
        textAlign: 'left',
        lineHeight: '1.6'
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '10px',
        color: '#000'
    },
    date: {
        fontSize: '0.9rem',
        color: '#666',
        marginBottom: '30px'
    },
    section: {
        marginBottom: '20px'
    },
    heading: {
        fontSize: '1.5rem',
        marginBottom: '10px',
        color: '#000',
        borderBottom: '1px solid #333',
        paddingBottom: '5px'
    }
};

export default PrivacyPolicy;

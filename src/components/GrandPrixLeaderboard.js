import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const GrandPrixLeaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data, error } = await supabase
                    .from('weekly_leaderboard')
                    .select('*')
                    .limit(20); // Top 20

                if (error) throw error;
                setLeaders(data || []);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();

        // Refresh every minute
        const interval = setInterval(fetchLeaderboard, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={styles.towerContainer}>
            <div style={styles.towerHeader}>
                <div style={styles.flagIcon}>🏁</div>
                <div style={styles.titleContainer}>
                    <h3 style={styles.towerTitle}>GRAND PRIX</h3>
                    <span style={styles.weekLabel}>WEEKLY STANDINGS</span>
                </div>
            </div>

            <div style={styles.listContainer}>
                {loading ? (
                    <div style={styles.loading}>Pit Stop...</div>
                ) : leaders.length === 0 ? (
                    <div style={styles.empty}>No drivers yet!</div>
                ) : (
                    leaders.map((driver, index) => (
                        <div key={driver.user_id} style={styles.driverRow}>
                            <div style={styles.positionBox}>
                                <span style={styles.position}>{index + 1}</span>
                            </div>
                            <div style={styles.driverInfo}>
                                <div style={styles.driverName}>
                                    {driver.username || 'Anonymous'}
                                </div>
                                <div style={styles.driverStats}>
                                    {driver.games_played} Races
                                </div>
                            </div>
                            <div style={styles.pointsBox}>
                                {driver.total_score}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div style={styles.footer}>
                TOP 20
            </div>
        </div>
    );
};

const styles = {
    towerContainer: {
        width: '280px',
        backgroundColor: '#111',
        border: '4px solid #333',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0,0,0,0.5), 0 0 10px rgba(233, 69, 96, 0.2)',
        fontFamily: "'Roboto Condensed', sans-serif", // Ideally use a condensed font
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '800px'
    },
    towerHeader: {
        backgroundColor: '#e94560', // Theme Red
        padding: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderBottom: '4px solid #fff'
    },
    flagIcon: {
        fontSize: '2rem'
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    towerTitle: {
        margin: 0,
        color: '#fff',
        fontSize: '1.4rem',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        lineHeight: 1
    },
    weekLabel: {
        color: '#ffcbcb',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        letterSpacing: '2px'
    },
    listContainer: {
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#1a1a2e'
    },
    driverRow: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 10px',
        borderBottom: '1px solid #333',
        transition: 'background 0.2s',
        cursor: 'default'
    },
    positionBox: {
        width: '30px',
        height: '30px',
        backgroundColor: '#333',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '4px',
        marginRight: '10px',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    driverInfo: {
        flex: 1,
        overflow: 'hidden'
    },
    driverName: {
        color: '#fff',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '1rem'
    },
    driverStats: {
        color: '#888',
        fontSize: '0.75rem',
        textTransform: 'uppercase'
    },
    pointsBox: {
        backgroundColor: 'transparent',
        color: '#a3f7bf', // Green for points
        fontWeight: 'bold',
        fontSize: '1.1rem',
        minWidth: '50px',
        textAlign: 'right'
    },
    loading: {
        padding: '20px',
        textAlign: 'center',
        color: '#888',
        fontStyle: 'italic'
    },
    empty: {
        padding: '20px',
        textAlign: 'center',
        color: '#666'
    },
    footer: {
        backgroundColor: '#000',
        color: '#555',
        textAlign: 'center',
        padding: '5px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        letterSpacing: '2px',
        borderTop: '1px solid #333'
    }
};

export default GrandPrixLeaderboard;

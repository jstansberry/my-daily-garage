import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Ref to prevent duplicate profile fetches
    const fetchingProfileRef = React.useRef(null);

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                // FORCE TIMEOUT: If Supabase doesn't respond in 2.5s, force load the app.
                // This prevents hanging on the "Initializing App" screen.
                const timeoutPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({ data: { session: null }, error: new Error("Timeout") });
                    }, 2500);
                });

                const sessionPromise = supabase.auth.getSession();

                // Race the real call against the timeout
                const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]);

                if (error && error.message !== "Timeout") throw error;

                if (mounted) {
                    if (session) {
                        setSession(session);
                        setUser(session?.user ?? null);
                        if (session?.user) {
                            // Non-blocking profile fetch
                            fetchProfile(session.user.id);
                        } else {
                            setProfileLoaded(true); // No profile to load
                        }
                    }
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (mounted) {
                // Clear anonymous storage on explicit login
                // We check for SIGNED_IN event specifically
                if (event === 'SIGNED_IN') {
                    clearAnonymousStorage();
                }

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                    setProfileLoaded(true);
                }

                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const clearAnonymousStorage = () => {
        try {
            // Get all keys
            const keys = Object.keys(localStorage);

            // Whitelist of keys to PRESERVE
            // 1. cookieConcent -> User consent
            // 2. sb-* -> Supabase Auth tokens (CRITICAL)
            // 3. Any others? -> verified: remaining keys like 'driving-blind-*', 'cardle_state_*' are what we want to nuke.

            keys.forEach(key => {
                const isConsent = key === 'cookieConcent';
                const isSupabaseToken = key.startsWith('sb-');

                if (!isConsent && !isSupabaseToken) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {
            console.error("Failed to clear anonymous storage:", e);
        }
    };

    const fetchProfile = async (userId) => {
        if (fetchingProfileRef.current === userId) return; // Already fetching/fetched for this user
        fetchingProfileRef.current = userId;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data) {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setProfileLoaded(true);
        }
    };

    const loginWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'select_account'
                    }
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login failed");
        }
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Clear all local storage (game state, etc)
        // For logout, we might want to clear EVERYTHING or keep consensus? 
        // Existing logic cleared everything. Let's keep it consistent but maybe respect cookieConsent?
        // Actually, existing logic was localStorage.clear() which nukes consent too.
        // Let's refine this to be polite to the user's consent choice even on logout.

        // Old: localStorage.clear();
        // New: Be selective
        const consent = localStorage.getItem('cookieConcent');
        localStorage.clear();
        if (consent) {
            localStorage.setItem('cookieConcent', consent);
        }

        // Force refresh to reset React state completely
        window.location.reload();
    };

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);

    const value = {
        user,
        session,
        profile,
        isAdmin: profile?.is_admin || false,
        loginWithGoogle,
        logout,
        loading,
        profileLoaded,
        showLoginModal,
        openLoginModal,
        closeLoginModal
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

const styles = {
    loadingContainer: {
        color: '#fff',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#1a1a2e',
        fontFamily: 'Arial, sans-serif',
        flexDirection: 'column'
    },
    loadingText: {
        color: '#888',
        fontSize: '0.8rem',
        marginTop: '10px'
    }
};

export const useAuth = () => {
    return useContext(AuthContext);
};

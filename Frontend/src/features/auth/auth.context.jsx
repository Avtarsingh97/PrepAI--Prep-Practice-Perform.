import { createContext, useState, useEffect } from 'react';
import { getMe } from './services/auth.api';
import { useAuth0 } from '@auth0/auth0-react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => { 
    const { getAccessTokenSilently, isAuthenticated, isLoading: auth0Loading } = useAuth0();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const token = await getAccessTokenSilently();
                const userData = await getMe(token);
                setUser(userData?.user ?? null);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        if (!auth0Loading) {
            fetchUser();
        }
    }, [getAccessTokenSilently, isAuthenticated, auth0Loading]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
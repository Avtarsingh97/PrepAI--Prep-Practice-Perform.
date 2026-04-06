import { useContext } from 'react';
import { AuthContext } from '../auth.context.jsx';
import { login, register } from '../services/auth.api';
import { useAuth0 } from '@auth0/auth0-react';

export const useAuth = () => {
    const { logout: auth0Logout, loginWithRedirect, isAuthenticated, user: auth0User } = useAuth0();
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    const {user, setUser, loading, setLoading} = context;

    const handleLogin = async({email,password}) => {
        setLoading(true);
        try {            
            const data = await login({email,password});
            setUser(data.user);
        } catch (error) {
            console.error('Error logging in:', error);
        }finally {
            setLoading(false);
        }
    };

    const handleRegister = async({username,email,password}) => {
        setLoading(true);
        try {
            const data = await register({username,email,password});
            setUser(data.user);
        } catch (error) {
            console.error('Error registering:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async() => {
        setLoading(true);
        try {
            // Clear legacy token cookie
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            
            auth0Logout({ 
                logoutParams: { 
                    returnTo: window.location.origin 
                } 
            });
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setLoading(false);
        }
    }



    return {
        user,
        auth0User,
        loading,
        isAuthenticated,
        loginWithRedirect,
        handleLogin,
        handleRegister,
        handleLogout
    };
};
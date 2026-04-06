import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/auth',
    withCredentials: true
});

export async function register({username, email, password}) {
    try {
        const response = await api.post('/register', {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

export async function login({email, password}) {
    try {
        const response = await api.post('/login', {email, password});
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
    }
}


export async function logout() {
    try {
        const response = await api.get('/logout');
        return response.data;
    } catch (error) {
        console.error('Error logging out user:', error);
    }
}

export async function getMe(token) {
    try {
        const response = await api.get('/api/auth/get-me', {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}
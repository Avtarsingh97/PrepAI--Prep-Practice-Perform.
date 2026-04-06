import { useState, useContext } from 'react'
import '../auth.form.scss';
import { Link, useNavigate } from 'react-router';
// import { useAuth } from '../hooks/useAuth';
import { useAuth0 } from "@auth0/auth0-react";
// import { AuthContext } from "../auth.context";   

const Login = () => {
    const navigate = useNavigate();
    // const { setUser } = useContext(AuthContext);
    const { loginWithRedirect} = useAuth0();
    // const { loading, handleLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     await handleLogin({ email, password });
    //     navigate("/");
    // };

    // if (loading) {
    //     return <main><h1>Loading...</h1></main>
    // }
   
    const handleGoogleLogin = async () => {
        try {
            const res =  loginWithRedirect();
            res.isAuthenticated ? navigate("/dashboard") : navigate("/login");
            // setUser(res.user);
            // navigate("/");
        } catch (error) {
            console.error("Error logging in:", error);
        }
    }

    return (
        <main>
            <div className="form-container">
                <h2>Login</h2>

                {/* <form>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter your email' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter your password' />
                    </div>
                    <button className='button primary-button'>Login</button>
                </form>

                <p>Don't have an account? <Link to={"/register"}>Register</Link></p> */}

                <button
                    onClick={(e) => handleGoogleLogin()}
                    className='button primary-button login'
                >
                    Login with Google
                </button>
            </div>
        </main>
    )
}

export default Login
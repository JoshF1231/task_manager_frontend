

import {useState} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import {useAuth} from "./components/AuthProvider.tsx";
import axios from 'axios';


const api_url = 'http://localhost:5000';


function LoginForm() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const token = await login(username, password);
            console.log(token);
            localStorage.setItem('accessToken', token);
            navigate('/dashboard');
        }
        catch(error){
            console.log(error);
            alert('Login failed. Please check your credentials.');
        }

    }

    return(
        <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <p>Password</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    )
}

export default LoginForm;
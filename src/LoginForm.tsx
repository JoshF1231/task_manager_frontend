import {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const api_url = 'http://localhost:5000';


function LoginForm() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post(`${api_url}/login`, {
            username,
            password,
        })
            .then(response => {
                console.log(response.data);
                alert("Login successful");
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
                alert("Login failed. Please check the console for more details.");
            });
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
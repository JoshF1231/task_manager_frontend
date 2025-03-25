import React from 'react';
import { useAuth } from './components/AuthProvider.tsx'; // Adjust path as needed
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
    const auth = useAuth();

    // Redirect to login if the user is not authenticated
    if (!auth.isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container">
            <h1>Welcome, {auth.user?.username}!</h1>
            {/* Rest of your dashboard content */}
        </div>
    );
};

export default Dashboard;

import { useAuth} from "./components/AuthProvider.tsx";
import {Navigate} from "react-router-dom";

const Dashboard = () => {
    const auth = useAuth();
    if (!auth.isAuthenticated) {
        return <Navigate to="/login"/>;
    }
    return (
        <div className="container">
            <h1>Welcome! {auth.user?.username}</h1>
            {/* Rest of the dashboard content */}
        </div>
    );
};

export default Dashboard;

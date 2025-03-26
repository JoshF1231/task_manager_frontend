import{
    createContext,
    useContext,
    useEffect,
    useLayoutEffect,
    useState,
} from "react";
import axios, {AxiosError} from "axios";

const api_url = 'http://localhost:5000';


interface AuthContextType {
    isAuthenticated: boolean;
    user: unknown;
    token: string | null;
    login: (username: string, password: string) => Promise<string>;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    token: null,
    login: async () => {
        throw new Error("login function not implemented");
    },
    logout: () => {
        throw new Error("logout function not implemented");
    },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<unknown | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            // You might want to fetch user data here
        }
    }, []);

    const login = async (username: string, password: string): Promise<string> => {
        try {
            const response = await axios.post(`${api_url}/login`, {
                username,
                password,
            });
            const  access_token  = response.data;
            localStorage.setItem('token', access_token);
            setIsAuthenticated(true);
            console.log(access_token);
            setToken(access_token);
            const userData = await fetchUserData(access_token);
            setUser(userData);
            return access_token;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    console.log(axiosError.response.data);
                    console.log(axiosError.response.status);
                    console.log(axiosError.response.headers);
                } else if (axiosError.request) {
                    // The request was made but no response was received
                    console.log(axiosError.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', axiosError.message);
                }
                console.log(axiosError.config);
                alert("Login failed. Please check the console for more details.");
            }
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated,user,token,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>{
    const context = useContext(AuthContext);
    if (context == undefined){
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}

const fetchUserData = async (token: string) => {
    try {
        const response = await axios.get(`${api_url}/user`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};
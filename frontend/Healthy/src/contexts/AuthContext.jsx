import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && (parsedUser._id || parsedUser.id)) {
                    setIsAuthenticated(true);
                    setUser(parsedUser);
                } else {
                    // Invalid user data
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        // Ensure the user data has the correct ID field
        const userWithId = {
            ...userData,
            _id: userData._id || userData.id // Normalize the ID field
        };
        
        console.log('Storing user data:', userWithId); // Debug log
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userWithId));
        setUser(userWithId);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        isAuthenticated,
        loading,
        user,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

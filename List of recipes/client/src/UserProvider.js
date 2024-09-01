import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(true); 

    const toggleAuthorization = () => {
        setIsAuthorized(prev => !prev);
    };

    return (
        <UserContext.Provider value={{ isAuthorized, toggleAuthorization }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};

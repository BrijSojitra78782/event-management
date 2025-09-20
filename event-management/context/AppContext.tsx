import { useNavigation } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create the Context
export const AppContext = createContext({
    setLoading: (val: boolean) => {},
    loading: false,
});

// Custom hook to use the context
export const useAppContext = () => {
    let appContext = useContext(AppContext);
    const navigation = useNavigation();
  
    // to prevent going back when the global loader is true
    useEffect(() => {         
        const listener = (e:any)=> {
            if(appContext.loading) e.preventDefault();
        }
        
        navigation.addListener('beforeRemove', listener);
        
        return () => {
            navigation.removeListener('beforeRemove', listener);
        };
    },[appContext.loading]);
    
    return appContext;
};

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);
    
    return (
        <AppContext.Provider value={{ loading, setLoading }}>
            {children}
        </AppContext.Provider>
    );
};


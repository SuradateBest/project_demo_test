import React from "react";
import { useState, useEffect } from "react";
import { app } from "../../firebase";
import Spinner from "../Spinner/spinner";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        app.auth().onAuthStateChanged(async (currentUser) => {
            setCurrentUser(currentUser);
            setLoading(false);
        })
    }, [loading])

    if (loading) return <Spinner/>
    return <AuthContext.Provider value={{ currentUser }}>
        {children}
    </AuthContext.Provider>

}
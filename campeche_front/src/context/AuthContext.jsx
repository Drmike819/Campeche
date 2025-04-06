import { createContext, useState, useEffect } from "react";

// creamos un contexto global para acceder a la autenticacion de usuario 
export const AuthContext = createContext();

// componente que envolvera componentes para que usen el contexto (children)
export const AuthProvider = ({ children }) => {
    // alamacenamos los datos del usuario authenticado
    const [user, setUser] = useState(null);

    // obtenemos los datos del usuario desde el local storage
    useEffect(() => {
        // obtenemos los datos del usuario si esta se encuentra logeado
        const storedAccessToken = localStorage.getItem("access_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");
        const storedUserName = localStorage.getItem("userName");
        const storedUserEmail = localStorage.getItem("userEmail");
        const storedUserImage = localStorage.getItem("userImage");

        // guardamos los datos del usuario 
        if (storedAccessToken) {
            console.log("✅ Cargando usuario desde localStorage...");
            setUser({
                accessToken: storedAccessToken,
                refreshToken: storedRefreshToken,
                userName: storedUserName,
                userEmail: storedUserEmail,
                userImage: storedUserImage,
            });
        }
    }, []);

    // funcion en donde se guardan los datos del usuario cuando se logea
    const login = ({ access, refresh, userName, userEmail, userImage }) => {
        console.log("💾 Guardando datos del usuario en localStorage...");
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("userImage", userImage);
        setUser({ accessToken: access, refreshToken: refresh, userName, userEmail, userImage });
    };

    // elimina los datos del usuario para cerrar sesiion
    const logout = () => {
        console.log("🚪 Cerrando sesión...");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userImage");
        setUser(null);
    };

    // devolvemos en contexto que envuelve todos los componentes hijos y podran acceder a (user, login, logout, setUser)
    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};




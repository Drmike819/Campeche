import { createContext, useState, useEffect } from "react";

// Crear el contexto
export const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  // indicamos que el contexto del usuario es null por defecto
  const [user, setUser] = useState(null);

  // Cargar datos desde localStorage
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token")
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userImage = localStorage.getItem("userImage");
    const userAddress = localStorage.getItem("userAddress");
    const userPhone = localStorage.getItem("userPhone");
    // verifica que las variables mas importantes no sean nulas
    if (accessToken && userName && userEmail && refreshToken) {
      // si en la verificacion no hay ningun valor nulo ingreamos los datos enviados por el backend
      setUser({ accessToken, refreshToken, userName, userEmail, userImage: userImage || "", userAddress: userAddress || "", userPhone: userPhone || "" });
    }
  }, []); // Solo se ejecuta una vez, cuando el componente se monta

  // Función de logout
  const LogOut = () => {
    // Limpiar los datos del localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userImage");
    localStorage.removeItem("userAddress");
    localStorage.removeItem("userPhone");

    // Limpiar el estado del usuario
    setUser(null);
  };
  // retornamos el estado global que utilizares envolviendo en la app principal
  return (
    <AuthContext.Provider value={{ user, setUser, LogOut }}>
      {children}
    </AuthContext.Provider>
  );
};

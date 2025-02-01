import { createContext, useState, useEffect } from "react";

// Crear el contexto
export const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cargar datos desde localStorage
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userImage = localStorage.getItem("userImage");
    const userAddress = localStorage.getItem("userAddress");
    const userPhone = localStorage.getItem("userPhone");

    if (accessToken && userName && userEmail && userImage && userAddress && userPhone) {
      // Si los datos están presentes, los cargamos en el estado
      setUser({ accessToken, userName, userEmail, userImage, userAddress, userPhone,
      });
    }
  }, []); // Solo se ejecuta una vez, cuando el componente se monta

  // Función de logout
  const logOut = () => {
    // Limpiar los datos del localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userImage");
    localStorage.removeItem("userAddress");
    localStorage.removeItem("userPhone");

    // Limpiar el estado del usuario
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export const NavUser = () => {
    const { user, logout } = useContext(AuthContext);
    console.log("🧑 Usuario en NavUser:", user);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/"); // Redirigir a la página de inicio tras cerrar sesión
    };

    return (
        <>
            {user ? (
                <li className="nav-item dropdown">
                    <a 
                        className="nav-link dropdown-toggle" 
                        href="/" 
                        id="navbarDropdown" 
                        role="button" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                    >
                        <img 
                            src={`http://127.0.0.1:8000${user.userImage}`} 
                            alt={user.userName} 
                            width="30" 
                            height="30" 
                            className="rounded-circle" 
                        />
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><Link className="dropdown-item" to="/profile">Perfil</Link></li>
                        <li><Link className="dropdown-item" to="/settings">Configuración</Link></li>
                        <li><button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button></li>
                    </ul>
                </li>
            ) : (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/register">Registrarse</Link>
                    </li>
                </>
            )}
        </>
    );
};

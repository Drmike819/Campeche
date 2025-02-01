import{AuthContext} from '../../context/AuthContext'
import { useContext } from "react";
import { Link } from "react-router-dom";
export const NavUser=()=>{
    const{user, LogOut} = useContext(AuthContext)
    return(
        <>
            {user ?(
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src={user.userImage} alt={user.userName} width="30" height="30" className="rounded-circle" />
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a className="dropdown-item" href="/register">Register</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                        <li><button className="dropdown-item" onClick={LogOut}>Cerrar sesión</button></li>
                    </ul>
                </li>
            ):(
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Iniciar sesión</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/register">Registrarse</Link>
                    </li>
                </>
            )}
        </>
    )
}
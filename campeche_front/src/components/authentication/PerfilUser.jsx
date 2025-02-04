import{AuthContext} from '../../context/AuthContext'
import { useContext } from "react";
import { Link } from "react-router-dom";
// funcion en la cual retornara cierto componente si el usuario esta logeado o no
export const NavUser=()=>{
    // obtenemos el contexto global del usuario
    const{user, LogOut} = useContext(AuthContext)
    // retornamos el componente
    return(
        <>
        {/* verificamos si el usuario esta logeado o no */}
            {user ?(
                // si esta esta logeado imprime lo soguiente
                <li className="nav-item dropdown">
                    {/* imagen del usuario */}
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src={`http://127.0.0.1:8000${user.userImage}`} alt={user.userName} width="30" height="30" className="rounded-circle" />
                    </a>
                    {/* opciones que el usuario puede compartir */}
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a className="dropdown-item" href="/register">Register</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                        <li><button className="dropdown-item" onClick={LogOut}>LogOut</button></li>
                    </ul>
                </li>
            ):(
                // si este no esta logeado imprime dos botones
                <>
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">LogIn</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/register">SingUp</Link>
                    </li>
                </>
            )}
        </>
    )
}
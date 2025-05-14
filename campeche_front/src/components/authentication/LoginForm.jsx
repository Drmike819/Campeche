import { useState, useEffect, useContext } from "react";
import axios from "axios";
// importamos el contexto global
import { AuthContext } from "../../context/AuthContext";
import { CampecheLogo } from "../images/CampecheLogo";
import { Link, useNavigate } from "react-router-dom";

// funcion principal
export const LoginForm = () => {
    // obtenemos la informacion del usuario con el contexto
    const { setUser } = useContext(AuthContext);
    // variable en donde obtenemos los campos del formulario
    const [formFields, setFormFields] = useState([]);
    // variable en donde guardamos la informacion de los campos
    const [formData, setFormData] = useState({});
    // variable de errores
    const [error, setError] = useState("");

    useEffect(() => {
        // funcion asincronica en donde obtendremos la informacion de los campos
        const fetchFormFields = async () => {
            // control de errores
            try {
                // alamcenamos la respuesta de la pai
                const response = await axios.get("http://127.0.0.1:8000/api/users/login/");
                // obtenemos y guardamos la informacion de la pai 
                setFormFields(response.data.fields);
                // variable en donde inicializamos el valor de cada campos
                const initialFormData = {};
                // indicamos que cada campo tendr aun valor vacio por defecto
                response.data.fields.forEach(field => initialFormData[field.name] = "");
                // guadamos el campo y su valor 
                setFormData(initialFormData);
            } catch (error) {
                // error
                setError("Error al cargar el formulario.");
            }
        };
        // llamamos a la funcion
        fetchFormFields();
    }, []);


    // funcion en donde guardaremos los eventos del formulario 
    const handleChange = (e) => {
        // cadxa vez que el usuario interactua hacemos uun copia de seguridad inidcando en nombre del
        //  campo en el que estamos y indicando el valor  que el usuario esta cambiando
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // funcion a la hora de enviar el formulario
    const handleSubmit = async (e) => {
        // indicamos que las acciones del formulario por defecto se anulan
        e.preventDefault();
        // captura de errores
        try {
            // guardamo la infoamcion de la solicitud
            const response = await axios.post("http://127.0.0.1:8000/api/users/login/", formData);
            // obtenemos la informacion previamente guardada
            const { access, refresh, userName, userEmail, userImage  } = response.data;
            // alamcenamos la informacion el el local storage
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            localStorage.setItem("userName", userName);
            localStorage.setItem("userEmail", userEmail);
            localStorage.setItem("userImage", userImage);
            // guardamos la informacion en el contexto
            setUser({ accessToken: access, refreshToken: refresh, userName, userEmail, userImage  });
        } catch (error) {
            // error
            setError("Credenciales inválidas.");
        }
    };

    // retornamos el formulario
    return (
        <div className="ms-auto me-auto login-container h-100 bg-light p-3">
            <div className="row mb-3">
                <div className="col-6">
                    <CampecheLogo width="100px" height="100px"/>
                </div>
                <div className="col-6">
                    <h2 className="mt-4">LogIn</h2>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                {formFields.map(field => (
                    <div key={field.name} className="form-floating mb-3">
                        <input
                            id={field.name}
                            className="form-control bg-gray"
                            type={field.type}
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            required={field.required}
                            placeholder={field.label}
                        />
                        <label htmlFor={field.name}>{field.label}</label>
                    </div>
                ))}
                <button type="submit" className="btn btn-primary w-100">LogIn</button>
                <div className="d-flex justify-content-between mt-2">
                    <Link className="text-blue text-decoration-none" to="/register">Registrarme</Link>
                    <Link className="text-blue text-decoration-none" to="/register">Recuperar contraseña</Link>
                </div>

            </form>
        </div>
    );
};
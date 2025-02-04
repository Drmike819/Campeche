import { useState, useEffect, useContext} from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
// creamos una funcion que nos retornara un formulario
export const LoginForm = () => {
    // constante en donde actualizares el estado del usuario de forma global
    const { setUser } = useContext(AuthContext);
    // aqui lamavcenaremos los campos del formulario
    const [formFields, setFormFields] = useState([]);
    // aqui almacenaremos la informacion proporcinada por el usuario
    const [formData, setFormData] = useState({});
    // almacenamos los errores
    const [error, setError] = useState("");
    // almacenamos las validaciones
    const [success, setSuccess] = useState("");

    // funcion que nos permitira obtener los campos del formulario
    useEffect(() => {
        // creamos una funcion para obtener los campos
        const fetchFormFields = async () => {
            try {
                // idicamos que el metodo de peticion de la api es(GET) y guardamos los datos en response
                const response = await axios.get("http://127.0.0.1:8000/api/users/login/");
                // almacenamos la data en setFormFields
                setFormFields(response.data.fields);
                // mensaje de campos cargados correctamente
                console.log("Campos cargados correctamente");

                // Inicializar el estado con valores vacíos
                const initialFormData = {};
                // recorremos la informacion de la api
                response.data.fields.forEach((field) => {
                    // inidcamos que el valor de los campos es un estring vacio
                    initialFormData[field.name] = "";
                });
                // llamamos a la funcion para que se ejecute 
                setFormData(initialFormData);
            // mensaje de error en caso de que algo salga mal
            } catch (error) {
                console.error("Error al cargar los campos del formulario", error);
                setError("Error al cargar los campos del formulario.");
            }
        };
        // llamamos a la funcion
        fetchFormFields();
    }, []);

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        // hacemos un copia de los campos mientrtas el usuario va escribiendo
        setFormData({ ...formData, [name]: value });
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        // restringimos el comportamiento del formulario por defecto
        e.preventDefault();

        setError(""); // Limpiar errores previos
        setSuccess(""); // Limpiar mensaje de éxito previo

        // verificamos que el usuario llene los campos 
        if (!formData.username || !formData.password) {
            setError("Campos vacíos. Por favor llene los campos del formulario.");
            // rompemos la funcion
            return;
        }
        // capturamos el error
        try {
            // hacemos una peticion a la pai con el metodo(POST) y la guardamos el response
            const response = await axios.post("http://127.0.0.1:8000/api/users/login/", formData);

            // Guardar tokens y la informacion del susuario en localStorage
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            localStorage.setItem("userName", response.data.userName);
            localStorage.setItem("userEmail", response.data.userEmail);
            localStorage.setItem("userImage", response.data.userImage);
            localStorage.setItem("userAddress", response.data.userAddress);
            localStorage.setItem("userPhone", response.data.userPhone);
            // mensaje de exito
            setSuccess("Inicio de sesión exitoso.");
            console.log("Usuario autenticado:", response.data);
            // actualizamos al usuario de forma global                                                                                                      
            setUser({
                accessToken: response.data.access,
                refreshToken: response.data.refresh,
                userName: response.data.username,
                userEmail: response.data.email,
                userImage: response.data.userImage,
                userAddress: response.data.userAddress,
                userPhone: response.data.userPhone,
              });

            // Redirigir al usuario si es necesario
            // window.location.href = "/dashboard";

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError("Credenciales inválidas. Verifique su usuario y contraseña.");
        }
    };
    // retornamos el formulario
    return (
        // contenedor principla
        <div className="container mt-5">
            <h2>LogIn</h2>
            {/* mensajes que se mostrara cuando el usuario ejecute una accion */}
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {success && <div className="alert alert-success text-center">{success}</div>}
            {/* formulario, indicamos que cuando se envie el formulario llamamaos a la funcion handleSubmit */}
            <form onSubmit={handleSubmit}>
                {/* recorremos formFields */}
                {formFields.map((field) => (
                    // contenedor de los campos este tenda un indicador
                    <div key={field.name} className="form-floating mb-3">
                        {/* input del formulario con susu atributos */}
                        <input
                            type={field.type}
                            className="form-control"
                            id={field.name}
                            name={field.name}
                            // el valor del campo es el puesto por el usuario o por defecto una cadena de texto vacia
                            value={formData[field.name] || ""}
                            // interaccion del usuario que llama a la funcion handleChange
                            onChange={handleChange}
                            required={field.required}
                        />
                        <label htmlFor={field.name}>{field.label}</label>
                    </div>
                ))}

                <button type="submit" className="btn btn-primary">LogIn</button>
            </form>
        </div>
    );
};

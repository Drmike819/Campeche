import { useState, useEffect } from "react";
import axios from "axios";

export const LoginForm = () => {
    const [formFields, setFormFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/users/login/");
                setFormFields(response.data.fields); // Corregido el error en 'fields'
                console.log("Campos cargados correctamente");

                // Inicializar el estado con valores vacíos
                const initialFormData = {};
                response.data.fields.forEach((field) => {
                    initialFormData[field.name] = "";
                });

                setFormData(initialFormData);
            } catch (error) {
                console.error("Error al cargar los campos del formulario", error);
                setError("Error al cargar los campos del formulario.");
            }
        };
        fetchFormFields();
    }, []);

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(""); // Limpiar errores previos
        setSuccess(""); // Limpiar mensaje de éxito previo

        if (!formData.username || !formData.password) {
            setError("Campos vacíos. Por favor llene los campos del formulario.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/users/login/", formData);

            // Guardar tokens en localStorage
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);

            setSuccess("Inicio de sesión exitoso.");
            console.log("Usuario autenticado:", response.data);

            // Redirigir al usuario si es necesario
            // window.location.href = "/dashboard";
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError("Credenciales inválidas. Verifique su usuario y contraseña.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>LogIn</h2>
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {success && <div className="alert alert-success text-center">{success}</div>}

            <form onSubmit={handleSubmit}>
                {formFields.map((field) => (
                    <div key={field.name} className="form-floating mb-3">
                        <input
                            type={field.type}
                            className="form-control"
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ""} // Ahora el campo es controlado
                            onChange={handleChange}
                            required={field.required}
                        />
                        <label htmlFor={field.name}>{field.label}</label>
                    </div>
                ))}

                <button type="submit" className="btn btn-primary">Iniciar sesión</button>
            </form>
        </div>
    );
};

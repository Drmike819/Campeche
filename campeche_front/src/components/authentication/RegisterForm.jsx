// src/components/RegisterForm.js

// importamos useState(Nos permite alamcenar y actualizar informacion)
// importamos UseEffect(Nos permite elaborar una funcion apenas la url es  visitada)
import { useState, useEffect } from 'react';
// importamos axios(Nos permite hacer peticiones HTTP)
import axios from 'axios';

// creamos y importamos una funcion flecha que nos retornara el formulario de registro
export const RegisterForm = () => {
    // useState: este nos permitira almacenar los fields del formulario 
    // formFields: aqui se almacenan los campos enviados por el backend(username, email, ETC..)
    const [formFields, setFormFields] = useState([]);
    // useState: este nos permitira almacenar los datos escritos por el usuario
    // formData: aqui se almacenara en un diccionario (clave:valor)
    const [formData, setFormData] = useState({});
    // aqui almacenaremos los errores que pueden existir en el formulario
    const [error, setError] = useState('');
    // aqui almacenamos un mensaje que indica que todo est correcto
    const [success, setSuccess] = useState('');

    // useEffect: funcion que nos permite obtener los campos del formulario
    // se ejecuta apenas el componente sea llamado ya que no necesita ninguna dependecia
    useEffect(() => {
        const fetchFormFields = async () => {
            // capturacion de error
            try {
                // hacemos una solicitud(GET) y guardamos los datos en respose
                const response = await axios.get('http://127.0.0.1:8000/api/users/register/');
                // guardamos y actualizamos la informacion obtenida en setFormFields
                setFormFields(response.data.fields);
                // variable que almacenara los datos de los fields del formularios
                const initialFormData = {};
                // recorremos los campos
                response.data.fields.forEach(field => {
                    // obtenemos los nombres de cada field y le decimos que para cada campo su valor es vacio
                    initialFormData[field.name] = field.type === 'file' ? null : '';
                });
                // guardamos la el diccionario en setFormData
                setFormData(initialFormData);
            } catch (error) {
                // imprimimos en consola si existe algun error
                console.error('Error al cargar los campos del formulario', error);
            }
        };
        // llamamos aa la funcion
        fetchFormFields();
    }, []);

    // Manejar cambios en los campos del formulario
    // (e) = evento
    const handleChange = (e) => {
        // extaremos la informacion de los campos
        const { name, value, type, files } = e.target;
        // hace una copia y actualiza el valor de cada campo cada vez que el usuario interactua
        // ...formData se utiliza para no modificar los demas campos del formulario
        setFormData({
            ...formData,
            // verifica si el valor ingresado en un archivo o texto
            [name]: type === 'file' ? files[0] : value,
        });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        // cambias los comportamientos por defecto del formulario
        e.preventDefault();

        // Validación de contraseñas
        if (formData.password && formData.password2 && formData.password !== formData.password2) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        // creamos una variable que almacenara clave:valor
        const postData = new FormData();
        // recorre todas la claves de forData(nombres de los fields)
        for (let key in formData) {
            // guarda la clave(key)y su valor(formData[key])
            postData.append(key, formData[key]);
        }
        // ccptura de errores
        try {
            // hacemos una solicitud(POST) y la guardamos en response
            const response = await axios.post('http://localhost:8000/api/users/register/', postData, {
                // Necesario para enviar archivos
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
            // guardamos mensaje de ok
            setSuccess('Usuario registrado con éxito.');
            setError('')
        } catch (err) {
            // guardamos menaje de error
            setError('Error al registrar el usuario.');
            setSuccess('')
        }
    };
    // retornamos el formulario
    return (
            // contenedor del formulario
            <div className="container mt-5">
                {/* titulo del formulario */}
                <h2 className="text-center mb-4">Registro</h2>
                {/* alertas que mostara a la hora de enviarse el formulario */}
                {error && <div className="alert alert-danger text-center">{error}</div>}
                {success && <div className="alert alert-success text-center">{success}</div>}
                {/* formulario que a la hora de enviarse llam a la funcio handleSubmit */}
                <form onSubmit={handleSubmit}>
                    {/* recorre formFields para imprimir su valores */}
                    {formFields.map((field) => (
                    // contenedor de los campos del formulario este tendra un identificador en este caso el nombre del campo
                    <div key={field.name} className="form-floating mb-3">
                        {/* verifica si el tipo de dato a enviar es un archivo */}
                        {field.type === 'file' ? (
                        <>
                            <input
                                type="file"
                                className="form-control"
                                id={field.name}
                                name={field.name}
                                onChange={handleChange}
                                required={field.required}
                            />

                            <label htmlFor={field.name}>{field.label}</label>
                        </>
                        ) : 
                        (
                        <>
                            <input
                                type={field.type}
                                className="form-control"
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                required={field.required}
                                placeholder={field.label}
                            />

                            <label htmlFor={field.name}>{field.label}</label>
                        </>
                        )}
                    </div>
                    ))}

                    <button type="submit" className="btn btn-primary w-100">
                        Registrar
                    </button>
                </form>
            </div>
    );
};
import { useEffect, useState, useContext } from "react";
import axios from "axios";
// importamos el contexto
import { AuthContext } from '../../context/AuthContext';

// funcion principal
export const ProductForm = () => {
    // obtenemos la infocion del contexto
    const { user } = useContext(AuthContext);

    // variable en donde almacenaremos los campos del formulario
    const [formFields, setFormFields] = useState([]);
    // variable en donde almacenaremos la informacion del campo
    const [formData, setFormData] = useState({});
    // variable en donde elmacenamos las imagenes del nuevo produvto 
    const [selectedImages, setSelectedImages] = useState([]);
    // variables en donde almacenamos los mensajes de error, o satisfaccion
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // funcion que se ejecuta cuando se visita el componente o cuando el usuario inicia sesion
    useEffect(() => {
        // verificamos si el usuario esta logeado y tiene el token 
        if (!user?.accessToken) {
            // si no esta retornamos un mensaje de error
            setError("No estás autenticado o el token no está disponible.");
            return;
            
        }
        // funcion asincronica para obtener oso campos del formulario
        const getFormFields = async () => {
            // manejo de errores
            try {
                // guardamo la infoamcion de la peticion
                const response = await axios.get(
                    'http://127.0.0.1:8000/api/products/form/new-product/',
                    {
                        // inidcamos el header para darle accedo al endPoint protejido
                        headers: {
                            // la autorizacion es el token del usuiario
                            'Authorization': `Bearer ${user.accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                // guardamos la informacion obtenida
                setFormFields(response.data.fields);

                // inicializamos la informacion de los campos
                const initialFormData = response.data.fields.reduce((acc, field) => {
                    // indicamos que los campos tipo texto estaran vaciion y los numericos tendran un numero predeterminado
                    acc[field.name] = field.type === "number" ? 0 : "";
                    // retornamos la infoamcion
                    return acc;
                }, {});

                // guatrdamos la infoamcion
                setFormData(initialFormData);
            } catch (error) {
                // errores
                setError("Error al obtener el formulario. Verifica tu conexión o autenticación.");
                console.error("Detalles del error:", error);
            }
        };

        // llamamos la funcion
        getFormFields();
        // condicion para que la funcion se ejecute
    }, [user?.accessToken]);

    // funcion para los cambios de la infoamcion del dormulario
    const handleChange = (e) => {
        // obtenemos el nombre y el valor del campo
        const { name, value } = e.target;
        // asifnamos el evento al campo en conccreto
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    // funcion para guardar las imagenes selecionadas por el usuario
    const handleImagesChange = (e) => {
        setSelectedImages([...e.target.files]);
    };

    // funcion que se ejecutara a la hora de enviar el formulario
    const handleSubmit = async (e) => {
        // inidcamos que las funciones por defecto del formulario se desactibaran 
        e.preventDefault();

        // gObtenemos la infomacion 
        const { price, stock, category } = formData;

        // verificamos que el precio y el stock no sea sero o negativo
        if (parseFloat(price) <= 0 || parseInt(stock) < 0) {
            // error
            setError("El precio debe ser mayor a 0 y el stock no puede ser negativo.");
            return;
        }

        // manejo de errores
        try {
            //  creamos una instacionde FormDta para poder enviar datos pesados(Archivos etc)
            const formDataToSend = new FormData();

            // convertimos formData en FormData convientiendolo en una arreglo calve valor
            Object.entries(formData).forEach(([key, value]) => {

                if (key === "category") {
                    // Verificar si `category` es un array o un ID único
                    if (Array.isArray(value)) {
                        //  Convertimos la categoria en un JSON tipo string
                        formDataToSend.append(key, JSON.stringify(value));
                    } else {
                        // si no es una lista enviamos el valor
                        formDataToSend.append(key, value);
                    }
                    // indicamos las claves
                } else if (key === "price" || key === "stock") {
                    // Convertir valores numéricos correctamente
                    formDataToSend.append(key, key === "price" ? parseFloat(value) : parseInt(value));
                } else {
                    // agregamos la infoamcion
                    formDataToSend.append(key, value);
                }
            });

            // recorremos las imagnes selecionadas por el usuario y añadimos una por una
            selectedImages.forEach(image => {
                formDataToSend.append("images", image);
            });

            // imprimimos la informacion que se eviara
            console.log("📤 Enviando datos:", Object.fromEntries(formDataToSend.entries())); // Debug

            // hacemos una solicitud pos enviando la informacion y la autorizacion
            await axios.post(
                'http://127.0.0.1:8000/api/products/form/new-product/',
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${user.accessToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // mensaje de satisfaccion
            setSuccess("Producto registrado correctamente.");
            setError('');

            // Restaurar formulario a valores iniciales
            const resetFormData = formFields.reduce((acc, field) => {
                acc[field.name] = field.type === "number" ? 0 : "";
                return acc;
            }, {});
            setFormData(resetFormData);
            setSelectedImages([]);

        } catch (error) {
            // errores
            if (error.response) {
                console.error("Detalles del error:", error.response.data);
                setError(`Error: ${JSON.stringify(error.response.data)}`);
            } else {
                console.error("Error desconocido:", error);
                setError("Ocurrió un error inesperado.");
            }
        }
    };

    // retornamos el formulario
    return (
        <div className="container mt-5">
            <h1 className="text-center">Nuevo Producto</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
                {formFields.map((field, index) => (
                    <div key={`${field.name}-${index}`} className="form-floating mb-3">
                        {(field.type === "text" || field.type === "number") && (
                            <input
                                type={field.type}
                                className="form-control"
                                id={field.name}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                placeholder={field.label}
                            />
                        )}
                        {field.type === "select" && (
                            <select
                                className="form-control"
                                id={field.name}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione una opción</option>
                                {field.options.map(option => (
                                    <option key={`${option.value}-${index}`} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                        {field.type === "file" && (
                            <input
                                type="file"
                                className="form-control"
                                id={field.name}
                                name={field.name}
                                multiple={field.multiple}
                                onChange={handleImagesChange}
                            />
                        )}
                    </div>
                ))}
                <button type="submit" className="btn btn-primary w-100">Registrar nuevo producto</button>
            </form>
        </div>
    );
};
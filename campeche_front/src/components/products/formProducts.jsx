import { useEffect, useState, useContext } from "react";
import axios from "axios";
import{AuthContext} from '../../context/AuthContext'

export const ProductForm = () => {
    // Consumir el contexto de autenticación
    const { user } = useContext(AuthContext);

    // Almacenamos los campos dinámicos enviados por el backend
    const [formFields, setFormFields] = useState([]);
    // Datos del formulario
    const [formData, setFormData] = useState({});
    // Imágenes seleccionadas
    const [selectedImages, setSelectedImages] = useState([]);
    // Mensajes de error y éxito
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Validar si existe un usuario autenticado
    useEffect(() => {
        const getFormFields = async () => {
            try {
                console.log('Infooooo',user, user.accessToken)
                // Validar si el usuario tiene un token disponible
                if (!user || !user.accessToken) {
                    setError("No estás autenticado");
                    return;
                }

                console.log("Token desde el contexto:", user.accessToken);

                const response = await axios.get(
                    'http://127.0.0.1:8000/api/products/form/new-product/',
                    {
                      headers: {
                        'Authorization': `Bearer ${user.accessToken}`,
                        'Content-Type': 'application/json'
                      },
                      withCredentials: true  // ← Correctamente colocado dentro del config object
                    }
                  );
                

                setFormFields(response.data.fields);

                // Inicializar datos del formulario
                const initialFormData = {};
                response.data.fields.forEach(field => {
                    initialFormData[field.name] = '';
                });
                setFormData(initialFormData);
            } catch (error) {
                setError("Error al obtener el formulario");
                console.error(error);
            }
        };

        getFormFields();
    }, [user]);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejar imágenes seleccionadas
    const handleImagesChange = (e) => {
        setSelectedImages([...e.target.files]);
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de precio y stock en el frontend
        const { price, stock } = formData;
        if (parseFloat(price) <= 0) {
            setError("El precio debe ser mayor a 0");
            return;
        }
        if (parseInt(stock) < 0) {
            setError("El stock no puede ser negativo");
            return;
        }

        try {
            const formDataToSend = new FormData();

            // Agregar datos al FormData
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            // Agregar imágenes seleccionadas
            selectedImages.forEach(image => {
                formDataToSend.append("images", image);
            });

            const response = await axios.post(
                'http://127.0.0.1:8000/api/products/form/new-product/',
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${user.accessToken}`
                    }
                }
            );

            setSuccess("Producto registrado correctamente");
            setError('');
            setFormData({});
            setSelectedImages([]);

        } catch (error) {
            setError("Error al registrar el producto");
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Nuevo Producto</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
                {formFields.map((field) => (
                    <div key={field.name} className="form-floating mb-3">
                        {field.type === "text" && (
                            <>
                                <input
                                    type="text"
                                    className="form-control"
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.label}
                                />
                                <label htmlFor={field.name}>{field.label}</label>
                            </>
                        )}
                        {field.type === "number" && (
                            <>
                                <input
                                    type="number"
                                    className="form-control"
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.label}
                                />
                                <label htmlFor={field.name}>{field.label}</label>
                            </>
                        )}
                        {field.type === "select" && (
                            <>
                                <select
                                    className="form-control"
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione una opción</option>
                                    {field.options.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor={field.name}>{field.label}</label>
                            </>
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
                <button type="submit" className="btn btn-primary w-100">
                    Registrar nuevo producto
                </button>
            </form>
        </div>
    );
};


// {(field.type === "text" || field.type === "email" || field.type === "password") && (
//     <input
//         type={field.type}
//         className="form-control"
//         id={field.name}
//         name={field.name}
//         value={formData[field.name] || ""}
//         onChange={handleChange}
//         required={field.required}
//     />
// )}

{/* {field.type === "multi-select"  &&
    <select
        multiple
        className="form-control"
        id={field.name}
        name={field.name}
        value={formData[field.name] || []}
        onChange={handleChange}
        required={field.required}
    >
        {field.options.map(option => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
} */}

// {field.type === "select" ? (
//     <select
//         className="form-control"
//         id={field.name}
//         name={field.name}
//         value={formData[field.name]}
//         onChange={handleChange}
//         required={field.required}
//     >
//         <option value="">Seleccione una opción</option>
//         {field.options.map((option) => (
//             <option key={option.value} value={option.value}>
//                 {option.label}
//             </option>
//         ))}
//     </select>
// ) : (
//     <input
//         type={field.type}
//         className="form-control"
//         id={field.name}
//         name={field.name}
//         value={formData[field.name]}
//         onChange={handleChange}
//         required={field.required}
//     />
// )}
// <label htmlFor={field.name}>{field.label}</label>
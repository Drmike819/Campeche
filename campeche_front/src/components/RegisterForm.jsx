// src/components/RegisterForm.js

import { useState, useEffect } from 'react';
import axios from 'axios';

export const RegisterForm = () => {
    // Estado para manejar los campos del formulario dinámico
    const [formFields, setFormFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Cargar los campos del formulario al montar el componente
    useEffect(() => {
        const fetchFormFields = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/users/register/');
                setFormFields(response.data.fields);
                // Inicializar formData basado en los campos recibidos
                const initialFormData = {};
                response.data.fields.forEach(field => {
                    initialFormData[field.name] = field.type === 'file' ? null : ''; // Para los campos de tipo file, dejamos como null
                });
                setFormData(initialFormData);
            } catch (err) {
                console.error('Error al cargar los campos del formulario', err);
            }
        };

        fetchFormFields();
    }, []);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value, // Para los campos de tipo 'file', almacenamos el archivo
        });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de contraseñas (si existen los campos)
        if (formData.password && formData.password2 && formData.password !== formData.password2) {
            setError('Las contraseñas no coinciden.');
            setSuccess('');
            return;
        }

        const postData = new FormData();
        for (let key in formData) {
            postData.append(key, formData[key]);
        }

        try {
            const response = await axios.post('http://localhost:8000/api/users/register/', postData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Necesario para enviar archivos
                },
            });
            setSuccess('Usuario registrado con éxito.');
            setError('');
        } catch (err) {
            setError('Error al registrar el usuario.');
            setSuccess('');
        }
    };

    return (
        <div>
            <h2>Registro</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}

            <form onSubmit={handleSubmit}>
                {formFields.map((field) => (
                    <div key={field.name}>
                        <label>{field.label}:</label>
                        {field.type === 'file' ? (
                            <input
                                type="file"
                                name={field.name}
                                onChange={handleChange}
                            />
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                required={field.required}
                            />
                        )}
                    </div>
                ))}
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};
import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

// creamos la funcion principal para listar los productos
export const ListProducts = () => {

    const url = 'http://127.0.0.1:8000/api/products/List-products/'
    // variable en donde almacenaremos todos los productos y su informacion esta es una lista
    const [products, setProducts] = useState([]);

    // funcion en donde se ejecutara cuando se pida el componente
    useEffect(() => {
        // funcion asincronica para obtener la informacion de todos los productos
        const GetALLProducts = async () => {
            // manaejo de errores
            try {
                console.log('Entrando a la funcion');
                // hacemos la peticion a la API y la amcanenamos en una variable
                const response = await axios.get(`${url}`);
                console.log('solicitud exitosa: ', response.data);
                // guardamos la informacion obtenida
                setProducts(response.data);
            } catch (error) {
                console.error('El error es:', error);
            }
        };
        // llamamos a la funcion asincronica
        GetALLProducts();
    }, []);

// retornamos el conetido obtenido en forma de HTML
    return (
        <div className="container mt-5 d-flex flex-wrap justify-content-center gap-4">
            {products.map((product) => (
                <Link key={product.id} to={`/DetailProduct/${product.id}/`} className="text-decoration-none">
                <div className="container-card-product card m-1 p-2 rounded-5">
                    {product.images.length === 1 ? (
                        <img
                            src={`http://127.0.0.1:8000/${product.images[0].image}`}
                            alt={product.name}
                            className="rounded-3 img-fluid"
                        />
                    ) : (
                        <img
                            src={`http://127.0.0.1:8000/${product.images[1].image}`}
                            alt={product.name}
                            className="rounded-3 img-fluid"
                        />
                    )}
                    <div className="card-body">
                        <h6>{product.name}</h6>
                        <p>{product.description}</p>
                    </div>
                    <div className="card-footer d-flex justify-content-between align-items-center w-100 p-2">
                        <span>{`$${product.price}`}</span>
                    </div>
                </div>
            </Link>
            
            ))}
        </div>

    );
};



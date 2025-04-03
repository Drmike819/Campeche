// importamos funciones de react
import { useEffect, useState } from "react";
// importamos axios para hacer solicitudes 
import axios from "axios";
// importamos la funcion params
import { useParams } from "react-router-dom";

// creamos la funcion principa indicando que esta se exportara
export const DetalleProduct = ()=>{
    // creamos una variable diccionario en donde almacenaremos la informacion de los productos
    const [product, setProduct] = useState()
    // creamos una variable diccionario en donde obtemos el ID
    const {productId} = useParams()

    const {error, setError} = useState()

    // creamos una funcion en donde indicamos que esta se ejecutara dependiendo del la accion definida
    useEffect(()=>{
        // creamos una funcion asincronica para hacer la peticion a la API
        const GetProduct = async () =>{
            // manejo de errores
            try {
                // creacion de una variable en donde almacenaremos la informacion obtenida por la solicitud
                const response = await axios.get(`http://127.0.0.1:8000/api/products/${productId}/`)
                // imprimimos la informacion en consola
                console.log(response.data)
                // indicamos que almacenaremos la informacion obtenida en SetProduct
                setProduct(response.data)
            } catch (error) {
                // impresion de los errores
                console.log(response.data)
                setError(response.data)
                
                console.log(error)
            }
        }
        // llamamos a la funcion asincronica
        GetProduct()
        // indicamos que la funcion se ejecutara cuando esta obtenga el id del producto
    },[productId])

    // if(error){
    //     return <div>{error}</div>
    // }

    if (!product) {
        return <div>Loading...</div>;
    }


    // retornamos la informacion del producto especifico
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    {product.images.length === 1 ? (
                        <img
                        src={`http://127.0.0.1:8000/${product.images[0].image}`}
                        alt={product.name}
                        className="img-fluid rounded-3"
                    />
                    ):(
                        <img
                        src={`http://127.0.0.1:8000/${product.images[1].image}`}
                        alt={product.name}
                        className="img-fluid rounded-3"
                    />
                    )}
                </div>
                <div className="col-md-6">
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>{`Price: $${product.price}`}</p>
                    {/* Agrega más información si es necesario */}
                    <div>
                        <h5>Images</h5>
                        <div className="d-flex flex-wrap gap-2">
                            {product.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={`http://127.0.0.1:8000/${image.image}`}
                                    alt={`Product image ${index + 1}`}
                                    className="img-thumbnail"
                                    style={{ width: "100px", height: "100px" }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
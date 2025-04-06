import { useEffect, useState } from "react";
import axios from "axios";

// funcion principal que retorna el componente
export const ProductsInCategories =()=>{
    // variable en donde lamacenamos las categorias y sus productos asociados
    const[CategoriesAndProducts, setCategoriesAndProducts] = useState([])

    // 
    useEffect(()=>{
        // funcion asincronica que obtiene la informacion
        const GetAllInformation = async ()=>{
            // manejo de errores
            try {
                // alamcenamos la respuesta de la peticion en una variable
                const response = await axios.get('http://127.0.0.1:8000/api/products/categories/')
                console.log(response)
                // alamcenamos la informacion obtenida
                setCategoriesAndProducts(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        // llamamos a la funcion asincronica
        GetAllInformation()
    },[])

// retornamos el componente HTML
return (
    <div className="container">
        {CategoriesAndProducts.map((info) => (
            <div key={info.id} className="container p-3 m-3 d-flex flex-wrap rounded-3 w-100">
                <h2 className="w-100 m-2">{info.name}</h2>
      
                {info.products.length === 0 ? (
                // Mostrar mensaje si no hay productos
                    <h2 className="text-center w-100 text-danger mt-5">No hay productos en esta categoría</h2>
                ) : (
                    // Mapear los productos si existen
                    <div className="d-flex flex-wrap w-100">
                        {info.products.map((product) => (
                            <div
                                key={product.id}
                                className="card container-card-category-product m-3 d-flex flex-column justify-content-between"
                                style={{ width: "18rem", minHeight: "400px" }} // Altura uniforme
                            >
                                <div className="m-2 flex-grow-1">
                                    <strong>
                                    <h3 className="text-center">{product.name}</h3>
                                    </strong>
                                    <p className="text-center">{product.description}</p>
                                </div>
                                <div className="m-4">
                                    <img
                                    src={`http://127.0.0.1:8000/${product.images[0].image}`}
                                    alt={product.name}
                                    className="img-fluid"
                                    style={{ maxHeight: "200px", objectFit: "cover" }}
                                    />
                                    <h4 className="mt-3">{`$${product.price}`}</h4>
                                </div>
                                <a href="#" className="text-center btn btn-primary mt-auto">
                                    Add carrito
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ))}
    </div>
);
      
       
}
// justify-content-center
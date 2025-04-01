import { useEffect, useState } from "react";
import  axios  from "axios";

// Creacion de la funcion en donde se  almacenaran las categorias
export const ListCategories = () =>{
    // constante para almacenar las categorias
    const[categories, setCategories] = useState([])
    // funcion que se ejecutar acuando se visite en componente
    useEffect(()=>{
        // funcion para obtener las categorias
        const GetAllCategories = async () => {
            // capturamos si hay algun error
            try {
                // hacemos una solicitud get a la api y almacenados su respuesta en response  
                const response = await axios.get('http://127.0.0.1:8000/api/products/categories/')
                console.log('Categorias cargadas con exito')
                // guardamos la informacion en setCategories()
                console.log(response)
                setCategories(response.data)
            } catch (error) {
                console.error('Error al cargar las cotaegorias', error)
            }
        }
        // llammaos la funcion 
        GetAllCategories()
    },[])

    // retornamos en componente
    return(
        <>
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Categories
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    {/* recorrrremos las categorias */}
                    {categories.map((category)=>(
                        // le damos el identificador de cada categoria
                        <li key={category.id}>
                            {/* imporimimos el nomvre y su descripcion */}
                            <a className="dropdown-item" href="#" title={category.description}>
                                {category.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </li>
        </>
    )
}
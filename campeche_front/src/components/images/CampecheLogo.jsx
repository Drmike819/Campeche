// componente el cual retorna el logo de la compañia, este pedira los parametros de sus proporciones
export const CampecheLogo=({width='90px', height='80px'})=>{
    // retorna la imagen
    return(
        // <img src="/public/images/Captura_de_pantalla_2025-03-19_143746-removebg-preview.png" 
        //     alt="Campeche Logo"
        //     style={{ width, height }} 
        // />
        <img src="/public/images/Captura de pantalla 2025-03-19 143746.png" 
            alt="Campeche Logo"
            style={{ width, height }}
            className="rounded-circle"
        />
        // <CampecheLogo width="200px" height="200px" />
    )
}
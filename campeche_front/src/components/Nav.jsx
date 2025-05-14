import { CampecheLogo } from "./images/CampecheLogo"
import { NavUser } from "./authentication/NavPerfilUser"
import { ListCategories } from "./products/Categories"
export const Nav=()=>{
    return(
        <nav className="navbar navbar-expand-lg bg-body-danger bg-success">
            
            <div className="container">

                <a href="http://localhost:5173/"><CampecheLogo /></a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <ListCategories/>
                    </ul>
                    
                    <ul className="navbar-nav ms -auto mb-2 mb-lg-0">
                        <NavUser />
                    </ul>
                </div>

            </div>
        </nav>
    )
}
import { Link } from "react-router-dom"

const Navigation =()=>{
    return(
        <>
        <nav>
            <ul>
                <li>
                    <Link to='/home'>Inicio</Link>
                    
                </li>
                <li>
                    <Link to='/contact'>Contacto</Link>
                </li>
            </ul>
        </nav>
        </>
    )
}
export default Navigation
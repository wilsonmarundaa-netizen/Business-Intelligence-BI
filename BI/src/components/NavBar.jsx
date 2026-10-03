import { NavLink } from "react-router-dom"
import "../index.css"

const NavBar = ()=>{
    return(
        <div className="navbar">

            <div className="logo">

                <h1>BI</h1>
                <h1>Business Intelligence</h1>

            </div>

            <div className="nav-items">

                <NavLink to="/"> Home </NavLink>
                <NavLink to="/about">About</NavLink>

            </div>

            

        </div>
    )
}

export default NavBar
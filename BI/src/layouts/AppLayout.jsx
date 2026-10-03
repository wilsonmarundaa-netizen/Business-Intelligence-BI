import NavBar from "../components/NavBar"
import "../index.css"

const AppLayout = ({children})=>{
    return(
        <div className="app-layout">
            <NavBar/>
            {children}
        </div>
    )
}

export default AppLayout 
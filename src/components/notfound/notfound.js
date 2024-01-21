import { Link } from "react-router-dom";
import "./notfound.css"


function Notfound(){
    return(
        <div>
            <div className="notfound-container">
                <h1>This page was not found</h1>
                <p>Please click on <Link to="/">Home Page</Link> to go back to home page</p>
            </div>
        </div>
    )
}

export default Notfound
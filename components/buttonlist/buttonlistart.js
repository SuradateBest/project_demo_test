import React from "react";
import { Link } from "react-router-dom";
import "../buttonlist/buttonlist.css"

const ButtonListArt = () => {

    return (
        <div className="container">
            <div className="button-grid">
                <Link to="/home">
                    <button className="button-2 max-w-125-px">
                        Main
                    </button>
                </Link>
                <Link to="/home/photo">
                    <button className="button-3 max-w-125-px">
                        Photo
                    </button>
                </Link>
                <Link to="/home/sculpture">
                    <button className="button-4 max-w-125-px">
                        Sculpture
                    </button>
                </Link>
            </div>
        </div>

    )
}

export default ButtonListArt;
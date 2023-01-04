import React from "react";
import { Link } from "react-router-dom";
import "../buttonlist/buttonlist.css"

const ButtonListPhoto = () => {

    return (
        <div className="container">
            <div className="button-grid">
                <Link to="/home">
                    <button className="button-3 max-w-125-px">
                        Main
                    </button>
                </Link>
                <Link to="/home/art">
                    <button className="button-2 max-w-125-px">
                        Art
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

export default ButtonListPhoto;
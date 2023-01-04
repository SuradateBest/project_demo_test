import React from "react";
import "../header/banner.css"

let bannerData = {
    title: "Welcome to Gallery",
    desc: "This area is many people of artist"
}

function Banner() {
    return (
        <div className="banner-bg">
            <div className="container">
                <div className="banner-con">
                    <div className="banner-text">
                        <h1>{bannerData.title}</h1>
                        <span>{bannerData.desc}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner;
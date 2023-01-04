import React, { useEffect, useState } from "react";

const Spinner = () =>{
    const [loading ,setLoading] = useState(true);
  
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
          }, 2000);
          return () => clearTimeout(timer);
    }, []);
   
    return loading ? 
    <div className="main-load">
        <div className="pos-center">
            <label className="label-26">  Loading...</label>
        <div className="loader " />
        </div>
        
        </div> : <></>
}

export default Spinner;

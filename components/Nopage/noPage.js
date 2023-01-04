import React, { Fragment, useContext, useEffect, useState } from "react";
import { app } from "../../firebase";
import { AuthContext } from "../auth/Auth";
import NavbarArtist from "../navbar/navuser/NavbarArtist";


const Nopage = () => {
    const [type, setType] = useState("");
    const { currentUser } = useContext(AuthContext);
    const currentUserId = currentUser ? currentUser.uid : null;

    useEffect(() => {
        const intervalId = setInterval(() => {
            const docRef = app.firestore().collection("Users").doc(currentUserId)
            docRef.get().then((doc) => {
                if (doc.exists) {
                    var type = doc.data().Role;
                    setType(type.toString())
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }, 500)
        return () => clearInterval(intervalId);
    })


    return (

        <>
            <NavbarArtist role={type} />
            <div>
                <h1>
                    EROR 404
                </h1>
            </div>

        </>
    )
}

export default Nopage;
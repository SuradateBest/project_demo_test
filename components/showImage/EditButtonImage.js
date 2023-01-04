import React, { useContext, useEffect, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { useHistory, useParams } from 'react-router-dom';
import { app } from '../../firebase';
import { AuthContext } from '../auth/Auth';

export default function EditUserButton(props) {

    const { id } = useParams();
    const { title, caption, hastag } = props
    const history = useHistory();
    const [role, setRole] = useState();
    const [uiduser, setUid] = useState();
    const { currentUser } = useContext(AuthContext);

    const currentUserId = currentUser ? currentUser.uid : null;

    useEffect(() => {
        const intervalId = setInterval(() => {
            const docRef = app.firestore().collection("Users").doc(currentUserId);
            docRef.get().then((doc) => {
                if (doc.exists) setRole(doc.data().Role.toString());
                else history.push("/error404")
            }).catch((error) => {
                console.log("error")
            });
        }, 500)
        return () => clearInterval(intervalId);
    })
    //////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const intervalId = setInterval(() => {
            const docRefs = app.firestore().collection("Image").doc(id);
            docRefs.get().then((doc) => {
                if (doc.exists) setUid(doc.data().uid.toString());
                else history.push("/error404")
            }).catch((error) => {
                console.log("error")
            });
        }, 500)
        return () => clearInterval(intervalId);
    })

    const edit = (id, title, caption, hastag) => {
        var Hastag = ""
        for (let i = 0; i < hastag.length; i++) {
            Hastag += hastag[i].replace("#", "")
            if (!(i >= hastag.length - 1)) {
                Hastag += "_"
            }
        }
        history.push(`/editimage/${id}/${title}/${caption}/${Hastag}`);
    }

    const editImage = (id, title, caption, hastag) => {
        var str = ""
        for (let i = 0; i < hastag.length; i++) {
            str += hastag[i]
            if (!(i >= hastag.length - 1)) {
                str += ","
            }
        }
        history.push(`/admineditimage/${id}/${title}/${caption}/${hastag}`);
    }

    var admin = "Admin";
    if (currentUserId === uiduser) return <>

        <FaCog onClick={() => { edit(id, title, caption, hastag) }} size="15px" className='padding-left-10 cursor-allowed position-right-img'>
        </FaCog>

    </>
    if (role === admin) return <>

        <FaCog onClick={() => { editImage(id, title, caption, hastag) }} size="15px" className='padding-left-10 cursor-allowed position-right-img'>
        </FaCog>
    </>
    else return <></>
}
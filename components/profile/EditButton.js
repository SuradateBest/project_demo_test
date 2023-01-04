import React, { useContext } from 'react';
import { FaCog } from 'react-icons/fa';
import { useHistory, useParams } from 'react-router-dom';
import { AuthContext } from '../auth/Auth';
import "../profile/profile.css"

export default function EditButton(props) {
    const { name, detail, image } = props
    const { id } = useParams();
    const history = useHistory();
    const { currentUser } = useContext(AuthContext);
    const currentUserId = currentUser ? currentUser.uid : null;


    const edit = (name, detail) => {
        var result = image.split("https://firebasestorage.googleapis.com/v0/b/react-project-7899e.appspot.com/o/").join("");
        result = result.split("/").join("!");
        result = result.split(".").join("@");
        history.push(`/editprofile/${id}/${name}/${detail}/${result}`);

    }

    if (currentUserId !== id) {
        return (
            <>
            </>
        )
    } else {
        return (
            <div className='setting'>
                <button className=" cursor-allowed" onClick={() => { edit(name, detail, image) }}>
                    <label className='label-14  cursor-allowed'>
                        Setting
                        <FaCog onClick={() => { edit(id) }} size="15px" className='padding-left-10'>
                        </FaCog></label>
                </button>
            </div>
        );
    }

}
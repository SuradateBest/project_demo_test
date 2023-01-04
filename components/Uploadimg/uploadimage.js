import React from "react";
import { app } from "../../firebase/index";
import "../Uploadimg/upload.css"
import { FaFolderOpen } from "react-icons/fa";

const UploadImage = (props) => {
    const onFileChange = async (e) => {
        const file = e.target.files[0];
        const storageRef = app.storage().ref();
        const fileRef = storageRef.child(`Image/${file.name}`);
        await fileRef.put(file);
        const link = await fileRef.getDownloadURL();
        props.imgUpload(link);
    };
    return (
        <div>
            <input
                id="file-input"
                type="file"
                onChange={onFileChange}
                accept="image/png, image/jpeg"
            />
            <label htmlFor="file-input"><FaFolderOpen></FaFolderOpen> Upload</label>
        </div>
    )
};
export default UploadImage;
import React, { useContext } from "react";
import NavbarArtist from "../navbar/navuser/NavbarArtist";
import UploadImage from "../Uploadimg/uploadimage";
import { useState } from "react";
import 'firebase/firestore';
import { Redirect, useHistory } from "react-router-dom";
import { AuthContext } from "../auth/Auth";
import useInput from "../hooks/input";
import { app } from "../../firebase";
import dateTime from "date-time";
import InputHastag from "./hastagInout";
import Swal from "sweetalert2";
import BannerUpload from "../header/headerupload";
import "../upLoadPage/uploadpage.css"

const UploadPage = () => {
    const [tags, setTags] = useState([])
    const [userName, setName] = useState("")
    const [addtype] = useState(["Art", "Photo", "Sculpture"])
    const [image, setImage] = useState("https://images.unsplash.com/photo-1595872018818-97555653a011?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=382&q=80");
    const [imageUser, setImageUser] = useState("");
    const [typerole, setType] = useState("");
    const { currentUser } = useContext(AuthContext)
    const currentUserId = currentUser ? currentUser.uid : null;
    const history = useHistory()

    const Add = addtype.map(Add => Add)

    const handleAddTypeChange = (e) => {
        setRole(addtype[e.target.value])
    }

    const [type, setRole] = useState('Art')
    const isNotEmpty = (value) => value.trim() !== "";

    const {
        value: title,
        isValid: enteredTitleIsValid,
        hasError: titleInputError,
        valueChangeHandler: titleChangeHandler,
        inputBlurHandler: titleBlurHandler,
    } = useInput(isNotEmpty);

    const {
        value: enteredCaption,
        valueChangeHandler: captionChangeHandler
    } = useInput(() => { });

    let formIsValid = false;

    if (enteredTitleIsValid) formIsValid = true;

    const userInputClasses = titleInputError
        ? "block uppercase text-red-500 "
        : "block uppercase    ";

    const formClassname = formIsValid
        ? "button-6"
        : " button-5  rounded shadow outline-none focus:outline-none  transition-all duration-150 cursor-not-allowed";

    const imgUploadHandler = (img) => {
        setImage(img);
    };


    const docRef = app.firestore().collection("Users").doc(currentUserId)
    docRef.get().then((doc) => {
        if (doc.exists) {
            setName(doc.data().Name.toString());
            setImageUser(doc.data().ProfileImg.toString());
            setType(doc.data().Role.toString());
        }
        else console.log("No such document!");
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    const submitHandler = (event) => {
        event.preventDefault();
        if (tags.length === 0) {
            Swal.fire({
                title: "You forgot hastag",
                text: "You must put hastag",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            })
        } else {

            app.firestore()
                .collection("Image")
                .doc()
                .set({
                    Title: title,
                    Caption: enteredCaption,
                    UserImage: userName,
                    Type: type,
                    Img: image,
                    Like: 0,
                    Datetime: dateTime({ showTimeZone: false }),
                    Likeuser: [],
                    uid: currentUserId,
                    tag: tags,
                    userImageProfile: imageUser
                }).then(function () {
                    history.push("/home");
                }).catch((error) => {
                    console.log(error)
                })
        }
    }
    if (!currentUser) return <Redirect to="/" />

    if (typerole === "Viewer") {
        history.push("/home")
    }
    return <div>
        <NavbarArtist role={typerole} />
        <BannerUpload />
        <div className="grid-uploadpage">
            <div className="container">


                <div className="box-4">
                    <div className="text-center header font-link">
                        <span>Image</span>
                    </div>
                    <div className="paddingleft-right ">
                        <img
                            alt="..."
                            src={image}
                            className="mx-auto max-w-full "
                        />
                    </div>
                    <div className="position-center-up">
                        <UploadImage imgUpload={imgUploadHandler} />
                    </div>
                </div>
                <div className="box-4 mt-3">
                    <div className="color-black">
                        <label className={userInputClasses}>
                            Title
                        </label>
                        <input type="text"
                            id="Title"
                            value={title}
                            onChange={titleChangeHandler}
                            onBlur={titleBlurHandler}
                            placeholder="Title"
                            className="mt-5" />
                        <label>Caption</label>
                        <textarea row="3"
                            id="caption"
                            value={enteredCaption}
                            type="text"
                            onChange={captionChangeHandler}
                            placeholder="Everything you want people to know"
                            className="mt-5"
                        />
                        <label>Hastags</label>
                        <InputHastag setTags={setTags} tags={tags} />
                        <label>Type</label>
                    </div>
                    <div className="mt-3">
                        <select
                            onChange={e => handleAddTypeChange(e)}
                            className="select-type" >
                            {Add.map((address, key) =>
                                <option key={key} value={key}>{address}</option>
                            )}
                        </select>
                    </div>
                    <form onSubmit={submitHandler} >
                        <div className="mt-3">
                            <button type="submit "
                                className={formClassname}
                                disabled={!formIsValid}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
}
export default UploadPage;
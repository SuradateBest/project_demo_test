import { Fragment, useContext, useEffect, useState } from "react";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";

import { app } from "../../firebase";
import 'firebase/firestore';

import Uploadimg from "../Uploadimg/uploadimg";
import { AuthContext } from "../auth/Auth";
import { doesUsernameExist } from "../../service/firebase";
import NavbarArtist from "../navbar/navuser/NavbarArtist";
import BannerProfile from "../header/headerprofile";


const EditProfile = () => {
    const { id, name, detail, image } = useParams();
    var result = image.split("!").join("/");
    result = result.split("@").join(".");
    result = "https://firebasestorage.googleapis.com/v0/b/react-project-7899e.appspot.com/o/" + result + "?alt=media&token=012c81c1-da6f-4f94-ab2e-45008a126b78"
    const [error, setError] = useState("");
    const [state, setState] = useState({
        Name: name,
        Detail: detail,
        ProfileImg: result,
    });
    const [disable, setDisable] = useState(false);
    const [profile, setProfile] = useState("");
    const history = useHistory();
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

    var box = document.getElementById('detail');
    var charlimit = 28; // char limit per line
    var space;
    function checklenght() {
        var lines = box.value.split('\n');
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].length <= charlimit) continue;
            var j = 0; space = charlimit;
            while (j++ <= charlimit) {
                if (lines[i].charAt(j) === ' ') space = j;
            }
            lines[i + 1] = lines[i].substring(space + 1) + (lines[i + 1] || "");
            lines[i] = lines[i].substring(0, space);
        }
        box.value = lines.slice(0, 10).join('\n');
    };

    function onInputChange(event) {
        const { name, value } = event.target

        setState((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
        if (state.Name === "" || state.Detail === "")
            setDisable(true)
        else setDisable(false)
    }


    const imgUploadHandler = (img) => {
        setProfile(img);
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        console.log(state)
        const usernameExists = await doesUsernameExist(state.Name);
        if (!usernameExists.length) {
            try {
                await
                    app
                        .firestore()
                        .collection("Users")
                        .doc(id)
                        .update({
                            Name: state.Name,
                            Detail: state.Detail,
                            ProfileImg: profile === "" ? result : profile,

                        })
                app
                    .firestore()
                    .collection("Image")
                    .where("uid", "==", id)
                    .get()
                    .then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            doc.ref.update({
                                UserImage: state.Name,
                                userImageProfile: profile === "" ? result : profile
                            })
                        })
                    })
                history.push('/home');
            } catch (error) {
            }
        } else {
            setError("That username is alreadys taken , please try another.");
        }

    }

    if (currentUserId !== id) {
        history.push("/home")
    }

    return (

        <Fragment>
            <NavbarArtist role={type} />
            <BannerProfile />
            <div className="container">
                <div className="box-2-edit">

                    <h1 className="text-center mt-0 color-black font-link">Your Profile</h1>

                    <div className="mb-5">
                        <div className="">
                            <img
                                alt="..."
                                src={profile === "" ? result : profile}
                                className=" max-w-100-px rounded-full border"
                            />
                        </div>
                    </div>
                    <form onSubmit={submitHandler} id="Signup-form" method="POST">
                        <div className="position-center-ed">
                            <Uploadimg imgUpload={imgUploadHandler} className="mt-5 " />
                        </div>
                        <div className=" mt-5 color-black">

                            <label >
                                Name:
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={state.Name}
                                name="Name"
                                maxLength="20"
                                onChange={onInputChange}
                                placeholder="Max 20 character"
                                className="mt-5" >

                            </input>


                            <div className="mt-3">
                                <label >
                                    About You:
                                </label>
                                <textarea row="3"
                                    id="detail"
                                    type="text"
                                    value={state.Detail}
                                    name="Detail"
                                    onChange={onInputChange}
                                    onKeyUp={checklenght}
                                    placeholder="28 character per line"
                                    className="mt-5"
                                    style={{ height: "100px", width: "300px" }} />

                            </div>


                            <div className="mt-3 button-center button-grid" >
                                <label className="error text-red text-size-16"
                                >{error}
                                </label>
                                <br></br>
                                <div>
                                    <button
                                        className={disable ? "button-disable " : "button-isable-img"}
                                        type="submit "
                                        disabled={disable}
                                    >
                                        Submit
                                    </button>
                                    <Link to="/home">
                                        <button
                                            className="button-isable-img1 ml-2"
                                        >
                                            Cancle
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default EditProfile;
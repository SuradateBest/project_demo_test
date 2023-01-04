import dateTime from 'date-time';
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { app } from "../../firebase";
import { AuthContext } from "../auth/Auth";
import useInput from "../hooks/input";

const Comment = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [imageUser,setImage] = useState("");
    const [docId, setDocId] = useState();
    const history = useHistory();
    const { currentUser } = useContext(AuthContext);

    const currentUserId = currentUser ? currentUser.uid : null;

    const isNotEmpty = (value) => value.trim() !== "";

    const {
        value: comment,
        isValid: enteredCommentIsValid,
        valueChangeHandler: commentChangeHandler,
    } = useInput(isNotEmpty);

    let formIsValid = false;
    if (enteredCommentIsValid) formIsValid = true;

    const formClassname = formIsValid
        ? " button-2"
        : " button-2  rounded shadow outline-none focus:outline-none  transition-all duration-150 cursor-not-allowed ";

    ///////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        const intervalId = setInterval(() => {
            const docRef = app.firestore().collection("Users").doc(currentUserId)
            docRef.get().then((doc) => {
                if (doc.exists) {
                    var Name = doc.data().Name;
                    var Imageuser = doc.data().ProfileImg;
                    setImage(Imageuser.toString());
                    setName(Name.toString());
                } else console.log("No such document!");
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }, 500)
        return () => clearInterval(intervalId); //This is important
    })
    ////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        const intervalId = setInterval(() => {
            const docRefImage = app.firestore().collection("Image").doc(id);
            docRefImage.get().then((doc) => {
                if (doc.exists) {
                    var docId = doc.id
                    setDocId(docId.toString());
                } else history.push("/error404")
            }).catch((error) => {
                console.log("Error")
            });
        }, 500)
        return () => clearInterval(intervalId); //This is important
    })
    /////////////////////////////////////////////////////////////////////////////

    const submitHandler = (event) => {
        event.preventDefault();
        app.firestore()
            .collection(`Image/${docId}/comment`)
            .doc()
            .set({
                User: name,
                comment: comment,
                uid: currentUserId,
                datetime: dateTime({ showTimeZone: false }),
                userImage:imageUser
            }).then(() => {
                window.location.reload(false);
            }).catch((error) => {
                console.log(error)
            })
    }

    return <Fragment>
        <div className="box-comment">
            <form onSubmit={submitHandler} >
                <div className="color-black">
                    <h1 className="font-name">Comment this place</h1>
                    <div>
                        <textarea
                            onChange={commentChangeHandler}
                            className="mt-5"
                            type="input"
                            placeholder="Comment..."
                            defaultValue=""
                            style={{ height: "150px", width: "700px" }} />
                    </div>
                    <div className="mt-3 ">
                        <button type="submit "
                            className={formClassname}
                            disabled={!formIsValid}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </Fragment>
}
export default Comment;
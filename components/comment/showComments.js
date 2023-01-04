import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { app } from "../../firebase";
import { FaTrash, FaUserSlash } from "react-icons/fa";
import { AuthContext } from "../auth/Auth";
import Swal from "sweetalert2";
import { delayMiliSecond } from "../../util/delay";
import "../../assets/style/font.css"

const ShowComments = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [docId, setDocId] = useState();
    const [posts, setPosts] = useState([]);
    const history = useHistory();
    const [role, setRole] = useState();
    const { currentUser } = useContext(AuthContext);

    const currentUserId = currentUser ? currentUser.uid : null;

    /////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        const intervalId = setInterval(() => {
            const docRefImage = app.firestore().collection("Image").doc(id);
            docRefImage.get().then((doc) => {
                if (doc.exists) {
                    var docId = doc.id
                    setDocId(docId.toString());
                    const docRef = app.firestore().collection("Users").doc(currentUserId);
                    docRef.get().then((doc) => {
                        if (doc.exists) {
                            var role = doc.data().Role;
                            setRole(role.toString());
                        } else history.push("/error404")
                    }).catch((error) => {
                        console.log("error")
                    });
                } else history.push("/error404")
            }).catch(() => {
                console.log("Error")
            });
        }, 500)
        return () => clearInterval(intervalId); //This is important
    })
    /////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const getPostsFromFirebase = [];
        const show = app
            .firestore()
            .collection(`Image/${docId}/comment`)
            .orderBy("datetime", "desc")
            .onSnapshot((querysnapshot) => {
                querysnapshot.forEach((doc) => {
                    getPostsFromFirebase.push({
                        ...doc.data(),
                        key: doc.id,
                    });
                });
                setPosts(getPostsFromFirebase);
                setLoading(false);
            });
        return () => show();
    }, [loading, docId]);

    /////////////////////////////////////////////////////////////

    const DeleteComment = (keycomment) => {
        Swal.fire({
            key: keycomment,
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false
                });
                try {
                    app.firestore()
                        .collection(`Image/${docId}/comment`)
                        .doc(keycomment)
                        .delete({})
                        .then(async () => {
                            await delayMiliSecond(1200)
                            await window.location.reload(false);
                        });
                } catch (err) { }
            }
        });
    };

    const BanUser = (keyuser) => {
        Swal.fire({
            key: keyuser,
            title: "Are you sure?",
            text: "You want to ban this user ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, ban this user !",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "User got ban!",
                    text: "This user got ban alreadys .",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false
                });

                try {
                    app.firestore()
                        .collection("Users")
                        .doc(keyuser)
                        .update({
                            Gotban: true,
                        })
                        .then(() => { });
                } catch (err) { }
            }
        });
    };

    const swapPage = (id) => {
        history.push(`/profile/${id}`);
    }


    var admin = "Admin";
    if (role === admin) return <Fragment>
        <div className=" mt-5">
            {posts.length > 0 ? (
                posts.map((post) =>
                    <div className="comments-grid mt-5" key={post.key} >
                        <div className="comments-grid-sub">
                            <div>
                                <img
                                    alt="Imge"
                                    src={post.userImage}
                                    className=" max-w-40-px rounded-full border image"
                                />
                            </div>
                            <div>
                                <div>
                                    <label onClick={() => { swapPage(post.uid) }} className="cursor-allowed font-name-com color-black" > Name : {post.User}
                                    </label>
                                </div>
                                <label className="font-title1 color-black mt-1"> Caption : {post.comment}</label><br></br>
                                <label className="label-14 mt-2 color-gray-time mt-1">{post.datetime}</label>
                                <div className="position-right">
                                    <FaUserSlash className="cursor-allowed padding-left-10 color-red" onClick={() => { BanUser(post.uid) }} />
                                    <FaTrash className="padding-left-10 color-red cursor-allowed" onClick={() => { DeleteComment(post.key) }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <label>No have comments</label>
            )}
        </div>
    </Fragment>
    else return <Fragment>
        <div className=" mt-3">
            {posts.length > 0 ? (
                posts.map((post) =>
                    <div className="comments-grid mt-3" key={post.key} >
                        <div className="comments-grid-sub">
                            <div>
                                <img
                                    alt="Imge"
                                    src={post.userImage}
                                    className=" max-w-40-px rounded-full border image"
                                />
                            </div>
                            <div>
                                <label onClick={() => { swapPage(post.uid) }} className="cursor-allowed font-name-com color-black"> Name : {post.User}</label><br></br>
                                <label className="font-title1 color-black mt-1"> Caption : {post.comment}</label><br></br>
                                <label className="label-14 mt-2 color-gray-time mt-1">{post.datetime}</label>
                            </div>
                        </div>
                    </div>)
            ) : (
                <label>No have comments</label>
            )}
        </div>
    </Fragment>
}
export default ShowComments;
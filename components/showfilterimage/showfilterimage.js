import React, { Fragment, useContext, useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../auth/Auth";
import { app } from "../../firebase";
import { firebase } from "../../firebase";
import NavbarArtist from "../navbar/navuser/NavbarArtist";
import Spinner from "../Spinner/spinner";
import { getUniqueArray } from "../../util/data";
import Banner from "../header/header";
import { Card } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import "../../assets/style/font.css"
import "../showfilterimage/headgrid.css"
//import NavbarViewer from "../navbar/navuser/Navbarviewer";


const ShowFilterImage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [filterpost, setFilterpost] = useState([])
    const [type, setType] = useState("");
    const history = useHistory();
    const [gotban, setGotBan] = useState();
    const [showmore, setShowmore] = useState(true)
    const { currentUser } = useContext(AuthContext);
    const currentUserId = currentUser ? currentUser.uid : null;

    useEffect(() => {
        const show = app
            .firestore()
            .collection("Image")
            .orderBy("Datetime", "desc")
            .onSnapshot((querysnapshot) => {
                const getPostsFromFirebase = [];
                querysnapshot.forEach((doc) => {
                    getPostsFromFirebase.push({
                        ...doc.data(),
                        key: doc.id,
                        isLike: doc.data().Likeuser.filter(likeuser => likeuser === currentUserId)

                    });
                });
                setPosts([])
                setFilterpost([])
                getUniqueArray(getPostsFromFirebase).map(tag => {
                    tag.tag.map(t => {
                        if (t === "#" + id) {
                            setPosts(posts => [...posts, tag])
                            setFilterpost(filterpost => [...filterpost, tag])
                        }
                    })
                })
                setLoading(false);

            });
        return () => show();

    }, [loading, currentUserId, id]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const docRef = app.firestore().collection("Users").doc(currentUserId)
            docRef.get().then((doc) => {
                if (doc.exists) {
                    var gotban = doc.data().Gotban;
                    var type = doc.data().Role;
                    setType(type.toString())
                    setGotBan(gotban);
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }, 500)
        return () => clearInterval(intervalId);
    })


    let user = gotban;

    if (!currentUser) {
        return <Redirect to="/" />;
    }

    if (currentUser && (user === true)) {
        return <Redirect to="/banpage" />;
    }

    const onSetLike = (type, key) => {
        var ImageLikealreadys = app.firestore().collection("Image").doc(key);
        if (type === "unlike") {
            var likeuser
            const like = posts.map(post => {
                if (post.key === key) {
                    post.isLike[0] = ""
                    likeuser = post.Like
                }
                return post
            })
            setPosts(getUniqueArray(like));
            ImageLikealreadys.update({
                Likeuser: firebase.firestore.FieldValue.arrayRemove(currentUserId),
                Like: likeuser - 1,
            });

        } else {
            var likeuser
            const like2 = posts.map(post => {
                if (post.key === key) {
                    post.isLike[0] = currentUserId
                    likeuser = post.Like
                }
                return post
            })
            setPosts(getUniqueArray(like2));
            ImageLikealreadys.update({
                Likeuser: firebase.firestore.FieldValue.arrayUnion(currentUserId),
                Like: likeuser + 1,
            });
        }

    }

    const handleAddTypeChange = (e) => {
        setPosts([])
        if (e.target.value === "") {
            setPosts(filterpost)
        } else {
            filterpost.map(choose => {
                if (choose.Type === e.target.value) {
                    setPosts(posts => [...posts, choose])
                }
            })
        }

    }


    const swapPage = (id) => {
        history.push(`/showimage/${id}`);
    }

    const swapPageProfile = (id) => {
        history.push(`/profile/${id}`);
    }

    return (
        <Fragment>
            <Spinner />
            <NavbarArtist role={type} />
            <div className="container">
                <Banner />
                <div className="container-card1 ">
                    <div className="grid-head-filter">
                        <div>
                            <h1 className="font-name" >
                                Filter Image
                            </h1>
                        </div>
                        <div className="mt-8">
                            <select style={{ width: "200px" }} onChange={e => handleAddTypeChange(e)}>
                                <option value="">Choose type</option>
                                <option value="Art">Art</option>
                                <option value="Photo">Photo</option>
                                <option value="Sculpture">Sculpture</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="container-card1">
                    <div className="main-grid ">
                        {posts.length > 0 ? (showmore ? (
                            posts.slice(0, 8).map(function (post) {
                                return <React.Fragment key={post.key}>

                                    <Card
                                        style={{ width: "200px" }}

                                    >
                                        {post.isLike[0] === currentUserId ?
                                            <div className="circle border zindex" style={{ zindex: "999", background: "white", position: "absolute", margin: "12.5rem 0rem 0rem 9.5rem" }} >
                                                <FaHeart className="color-pink" onClick={() => { onSetLike("unlike", post.key) }} style={{ zindex: "999", margin: "0.5rem 0rem 0rem 0.3rem", cursor: "pointer", position: "absolute" }} size="30px" /></div>
                                            : <div className="circle border zindex" style={{ zindex: "999", background: "white", position: "absolute", margin: "12.5rem 0rem 0rem 9.5rem" }} >
                                                <FaHeart onClick={() => { onSetLike("like", post.key) }} style={{ zindex: "999", margin: "0.5rem 0rem 0rem 0.3rem", color: "gray", cursor: "pointer", position: "absolute" }} size="30px" /></div>}

                                        <Card.Img className="radius cursor-allowed opacity-1"
                                            onClick={() => { swapPage(post.key) }}
                                            src={post.Img}
                                            width="200"
                                            height="250"
                                            variant="top"
                                            alt="" />

                                        <Card.Body  >
                                            <Card.Title className="mt-2 font-title" >
                                                <span> Title : {post.Title}</span>
                                            </Card.Title>
                                            <Card.Title className="font-name-main mt-minus cursor-allowed" onClick={() => { swapPageProfile(post.uid) }}>
                                                <div className="showimage-sub-main">
                                                    <div>
                                                        <img
                                                            alt="Imge"
                                                            src={post.userImageProfile}
                                                            className=" max-w-30-px rounded-full border image position-left-head"
                                                        />
                                                    </div>
                                                    <div className="mt-1">
                                                        <span> {post.UserImage}</span>

                                                    </div>
                                                </div>
                                            </Card.Title>
                                        </Card.Body>

                                    </Card>
                                </React.Fragment>
                            })
                        ) : (
                            posts.map(function (post) {
                                return <React.Fragment key={post.key}>

                                    <Card
                                        style={{ width: "200px" }}

                                    >
                                        {post.isLike[0] === currentUserId ?
                                            <div className="circle border zindex" style={{ zindex: "999", background: "white", position: "absolute", margin: "12.5rem 0rem 0rem 9.5rem" }} >
                                                <FaHeart className="color-pink" onClick={() => { onSetLike("unlike", post.key) }} style={{ zindex: "999", margin: "0.5rem 0rem 0rem 0.3rem", cursor: "pointer", position: "absolute" }} size="30px" /></div>
                                            : <div className="circle border zindex" style={{ zindex: "999", background: "white", position: "absolute", margin: "12.5rem 0rem 0rem 9.5rem" }} >
                                                <FaHeart onClick={() => { onSetLike("like", post.key) }} style={{ zindex: "999", margin: "0.5rem 0rem 0rem 0.3rem", color: "gray", cursor: "pointer", position: "absolute" }} size="30px" /></div>}

                                        <Card.Img className="radius cursor-allowed opacity-1 "
                                            onClick={() => { swapPage(post.key) }}
                                            src={post.Img}
                                            width="200"
                                            height="250"
                                            variant="top"
                                            alt="" />

                                        <Card.Body  >
                                            <Card.Title className="mt-2 font-title" >
                                                <span> Title : {post.Title}</span>
                                            </Card.Title>
                                            <Card.Title className="font-name-main mt-minus cursor-allowed" onClick={() => { swapPageProfile(post.uid) }}>
                                                <div className="showimage-sub-main">
                                                    <div >
                                                        <img
                                                            alt="Imge"
                                                            src={post.userImageProfile}
                                                            className=" max-w-30-px rounded-full border image position-left-head"
                                                        />
                                                    </div>
                                                    <div className="mt-1">
                                                        <span> {post.UserImage}</span>
                                                    </div>
                                                </div>
                                            </Card.Title>
                                        </Card.Body>

                                    </Card>
                                </React.Fragment>
                            })
                        )
                        ) : (
                            <h1>no have image show yet : (</h1>
                        )}
                    </div>
                </div>
                <div className="container-card1 ">
                    <button className="button-show" onClick={() => setShowmore(!showmore)}>
                        {showmore ? "Show More" : "Show Less"}
                    </button>
                </div>
            </div>
        </Fragment>
    );

}

export default ShowFilterImage;
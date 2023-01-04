/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { app } from "../../firebase";
import { firebase } from "../../firebase";
import { FaHeart } from "react-icons/fa";
import shuffle, { getUniqueArray } from "../../util/data";
import { AuthContext } from "../auth/Auth";
import "../recommend/popularwork.css"

const Recommend = (props) => {
    const { posts, setPosts } = props
    const history = useHistory();
    const [logTag, setLogTag] = useState([])
    const [filterPost, setFilterPost] = useState([])
    const [isError, setIsError] = useState(false)
    const { currentUser } = useContext(AuthContext);
    const currentUserId = currentUser ? currentUser.uid : null;

    const [showmore, setShowmore] = useState(true)

    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    useEffect(() => {
        var log = []
        async function getLog() {
            try {
                const docRefLog = app.firestore().collection("Log").doc(currentUserId)
                log = await docRefLog.get().then((doc) => {
                    return doc.data().tag
                })
                log.sort(dynamicSort("-view"))
                log.length = 3
                setLogTag(log)
            } catch (e) {
                setIsError(true)
            }
        }
        getLog()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posts]);

    useEffect(() => {
        try {
            var logFilterPost = []
            var logPostFilter = []
            //logTag.tagName
            async function filter() {
                logFilterPost = posts.map(value => value.tag)
                logFilterPost = logFilterPost.map((value, key) => {
                    logTag.map(tag => {
                        value.map(tagPost => {
                            if (tag.tagName === tagPost && !logPostFilter.includes(key)) {
                                logPostFilter.push(key)
                                return
                            }
                        })
                    })
                })
            }
            filter()

            var postAll = []
            posts.map((value, key) => {
                logPostFilter.map(index => {
                    if (index === key) {
                        postAll.push(value)
                        return
                    }
                })
            })

            setFilterPost(shuffle(postAll))
        } catch (error) {
            setIsError(true)
        }
    }, [logTag])

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

    const swapPage = (id) => {
        history.push(`/showimage/${id}`);
    }

    const swapPageProfile = (id) => {
        history.push(`/profile/${id}`);
    }

    return <Fragment>
        {(!isError && filterPost.length > 0) && (
            <div className="container">
                <div className="container-card1 res-margin">
                    <h1 className="font-name">
                        Recommended works
                    </h1>
                </div>
                <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                    <div className="container-card1">
                        <div className="main-grid ">
                            {showmore ? (
                                filterPost.slice(0, 4).map(function (post) {
                                    return <React.Fragment key={post.key}>

                                        <Card
                                            style={{ width: "200px", }}

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
                                                <Card.Title className="mt-3 font-title" >
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
                                filterPost.map(function (post) {
                                    return <React.Fragment key={post.key}>

                                        <Card
                                            style={{ width: "200px" }}
                                            onClick={() => { swapPage(post.key) }}
                                        >
                                            {post.isLike[0] === currentUserId ?
                                                <div className="circle border zindex" style={{ zindex: "999", background: "white", position: "absolute", margin: "12.5rem 0rem 0rem 9.5rem" }} >
                                                    <FaHeart className="color-pink" onClick={() => { onSetLike("unlike", post.key) }} style={{ zindex: "999", margin: "0.5rem 0rem 0rem 0.3rem", cursor: "pointer", position: "absolute" }} size="30px" /></div>
                                                : <div className="circle border zindex" style={{ zindex: "999", background: "white", position: "absolute", margin: "12.5rem 0rem 0rem 9.5rem" }} >
                                                    <FaHeart onClick={() => { onSetLike("like", post.key) }} style={{ zindex: "999", margin: "0.5rem 0rem 0rem 0.3rem", color: "gray", cursor: "pointer", position: "absolute" }} size="30px" /></div>}

                                            <Card.Img className="radius cursor-allowed opacity-1"
                                                src={post.Img}
                                                width="200"
                                                height="250"
                                                variant="top"
                                                alt="" />

                                            <Card.Body  >
                                                <Card.Title className="mt-3 font-title" >
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
                            )}
                        </div>
                    </div>
                </div>
                <div className="container-card1 res-margin">
                    <button className="button-show" onClick={() => setShowmore(!showmore)}>
                        {showmore ? "Show More" : "Show Less"}
                    </button>
                </div>
            </div>
        )}
    </Fragment >

}

export default Recommend;
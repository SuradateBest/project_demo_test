/* eslint-disable array-callback-return */
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { app } from "../../firebase";
import { firebase } from "../../firebase";
import { AuthContext } from "../auth/Auth";
import { FaHeart } from "react-icons/fa";
import Slider from "react-slick";
import { Card } from "react-bootstrap";
import "../../assets/style/font.css"
import { getUniqueArray } from "../../util/data";


const Follower = (props) => {
    const { posts, setPosts } = props
    const history = useHistory();

    const [following, setFollowing] = useState([])
    const [filterPost, setFilterPost] = useState([])

    const [isError, setIsError] = useState(false)
    const { currentUser } = useContext(AuthContext);
    const currentUserId = currentUser ? currentUser.uid : null;


    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 4,

                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,

                }
            },
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 2,

                }
            },
            {
                breakpoint: 650,
                settings: {
                    slidesToShow: 1,

                }
            }
        ]
    };


    useEffect(() => {
        try {
            async function getFollowing() {
                let following = []
                const docRefLog = app.firestore().collection("Users").doc(currentUserId)
                following = await docRefLog.get().then((doc) => {
                    return doc.data().following
                })
                setFollowing(following)
            }
            getFollowing()
        } catch (error) {
            setIsError(true)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posts]);

    useEffect(() => {
        try {
            let filterPostByFollowing = []
            posts.map(value => {
                following.map(id => {
                    if (id === value.uid) filterPostByFollowing.push(value)
                })
            })
            setFilterPost(filterPostByFollowing)
        } catch (error) {
            setIsError(true)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [following])

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
            <div className="container ">
                <div className="container-card" >
                    <h1 className="font-name" >
                        Works by users you are following
                    </h1>
                </div>

                <Slider {...settings}>
                    {filterPost.map(function (post) {
                        return <React.Fragment key={post.key} >
                            {post.isLike[0] === currentUserId ?
                                <div className="circle border" style={{ zindex: "1", position: "fixed", margin: "12.5rem 0rem 0rem 9.5rem", background: "white" }} >
                                    <FaHeart className="color-pink" onClick={() => { onSetLike("unlike", post.key) }} style={{ zindex: "999", position: "fixed", margin: "0.5rem 0rem 0rem 0.3rem", cursor: "pointer" }} size="30px" /></div>
                                : <div className="circle border" style={{ zindex: "1", position: "fixed", margin: "12.5rem 0rem 0rem 9.5rem", background: "white" }} >
                                    <FaHeart onClick={() => { onSetLike("like", post.key) }} style={{ zindex: "999", position: "fixed", margin: "0.5rem 0rem 0rem 0.3rem", color: "gray", cursor: "pointer" }} size="30px" /></div>}

                            <Card
                                style={{ width: "200px" }}
                            >
                                <Card.Img className="radius "
                                    onClick={() => { swapPage(post.key) }}
                                    src={post.Img}
                                    width="200"
                                    height="250"
                                    variant="top"
                                    alt="" />

                                <Card.Body  >
                                    <Card.Title className="mt-3 font-title">
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
                    }
                    )}</Slider>
            </div>

        )}
    </Fragment>
}

export default Follower;
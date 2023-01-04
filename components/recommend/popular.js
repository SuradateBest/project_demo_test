
import React, { Fragment, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Slider from "react-slick";
import "../recommend/popularwork.css"
import "../../assets/style/font.css"
import { FaHeart } from "react-icons/fa";
import { app } from "../../firebase";
import { firebase } from "../../firebase";
import { getUniqueArray } from "../../util/data";

const Popular = (props) => {
    const history = useHistory();
    const { posts, currentUserId, setPosts } = props;
    const [popular, setPoppular] = useState([])

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
        var popularpost = []
        // eslint-disable-next-line
        posts.map(posts => {
            popularpost.push(posts)
        })
        popularpost.sort(dynamicSort("-Like"))
        popularpost.length = 10
        setPoppular(popularpost)
    }, [posts]);

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

    return (
        <Fragment >
            <div className="container ">
                <div className="container-card" >
                    <h1 className="font-name" >
                        Top 10 Popular work
                    </h1>
                </div>

                <Slider {...settings} >
                    {popular.map(function (post, index) {
                        return <React.Fragment key={post.key} >
                            {post.isLike[0] === currentUserId ?
                                <div className="circle border" style={{ zindex: "1", position: "absolute", margin: "14.5rem 0rem 0rem 9.5rem", background: "white" }} >
                                    <FaHeart className="color-pink" onClick={() => { onSetLike("unlike", post.key) }} style={{ zindex: "999", position: "absolute", margin: "0.5rem 0rem 0rem 0.3rem", cursor: "pointer" }} size="30px" /></div>
                                : <div className="circle border" style={{ zindex: "1", position: "absolute", margin: "14.5rem 0rem 0rem 9.5rem", background: "white" }} >
                                    <FaHeart onClick={() => { onSetLike("like", post.key) }} style={{ zindex: "999", position: "absolute", margin: "0.5rem 0rem 0rem 0.3rem", color: "gray", cursor: "pointer" }} size="30px" /></div>}


                            <Card
                                style={{ width: "200px" }}
                            >
                                <div className="text-center">
                                    <span className="font-rate" >Rating#{index + 1}</span>
                                </div>
                                <Card.Img className="radius "
                                    src={post.Img}
                                    width="200"
                                    height="250"
                                    variant="top"
                                    alt=""
                                    onClick={() => { swapPage(post.key) }}
                                />

                                <Card.Body  >
                                    <Card.Title className="mt-3 font-title"  >
                                        <span > Title : {post.Title}</span>
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
                                    <Card.Title className="font-name-like mt-2">
                                        <span> Like : {post.Like}</span>
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </React.Fragment>
                    }
                    )}</Slider>
            </div>
        </Fragment>

    )

}

export default Popular;
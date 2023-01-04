/* eslint-disable array-callback-return */
import React, { Fragment } from "react";
import LikeButton from "./LikeButton";
import Comment from "../comment/Comment";
import ShowComments from "../comment/showComments";
import { useState, useEffect, useContext } from "react";
import NavbarArtist from "../navbar/navuser/NavbarArtist";
import { useHistory, useParams } from "react-router-dom";
import { app } from "../../firebase";
import 'firebase/firestore';
import FollowButton from "./FollowButton";
import EditUserButton from "./EditButtonImage";
import { AuthContext } from "../auth/Auth";
import "../showImage/showimage.css"
import BannerShowimg from "../header/headershowimg";

const ShowImage = () => {
    const { id } = useParams();
    const { currentUser } = useContext(AuthContext);
    const currentUserId = currentUser ? currentUser.uid : null;
    const [type, setType] = useState("");
    const [tagImage_, setTagImage_] = useState([]);
    const [tagLog_, setTagLog_] = useState([]);
    const [title, setTiltle] = useState("");
    const [image, setImage] = useState("");
    const [caption, setCaption] = useState("");
    const [uiduser, setUid] = useState("")
    const [userProfile, setUserProfile] = useState("");
    const [date, setDate] = useState("");
    const [owner, setOwner] = useState("");
    const history = useHistory();

    useEffect(() => {
        async function ft() {
            const docRefLog = app.firestore().collection("Log").doc(currentUserId)
            var log = await docRefLog.get().then((doc) => {
                setTagLog_(doc.data().tag)
                return doc.data().tag
            })

            const docRefImage = app.firestore().collection("Image").doc(id);
            var tagImage = await docRefImage.get().then(async (doc) => {
                setTagImage_(doc.data().tag)
                return doc.data().tag
            })

            if (log.length === 0) {
                tagImage.map(value => {
                    var logTest = [...log, {
                        tagName: value,
                        like: 0,
                        view: 1
                    }]
                    log = logTest
                })
            } else {
                var logTest = log
                tagImage.map(value => {
                    let count = 0
                    log.map((value1, key) => {
                        if (value === value1.tagName) {
                            count++
                            log[key].view++
                        }
                    })
                    if (count === 0) {
                        var test = [...logTest, {
                            tagName: value,
                            like: 0,
                            view: 1
                        }]
                        log = test
                    }
                })
            }
            await docRefLog.set({ tag: log })
            await docRefLog.get().then((doc) => { setTagLog_(doc.data().tag) })
            await docRefImage.get().then(async (doc) => { setTagImage_(doc.data().tag) })
        }
        ft()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const intervalId = setInterval(async () => {
            const docRef = app.firestore().collection("Image").doc(id);
            await docRef.get().then((doc) => {
                if (doc.exists) {
                    var Title = doc.data().Title;
                    var Caption = doc.data().Caption;
                    var Image = doc.data().Img;
                    var Owner = doc.data().UserImage;
                    var uid = doc.data().uid;
                    var date = doc.data().Datetime;
                    var profile = doc.data().userImageProfile;
                    setUserProfile(profile.toString());
                    setDate(date.toString());
                    setUid(uid.toString());
                    setTiltle(Title.toString());
                    setCaption(Caption.toString());
                    setImage(Image.toString());
                    setOwner(Owner.toString());

                } else history.push("/error404")

            }).catch((error) => { });
        }, 1000)
        return () => clearInterval(intervalId); //This is important
    })

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

    const swapPage = (id) => {
        history.push(`/profile/${id}`);
    }

    return <Fragment>
        <NavbarArtist role={type} />
        <BannerShowimg />
        <div className="container">
            <div className="box-showimage ">
                <div className="grid-showimage">
                    <div className="mt-2">
                        <div className="showimage-sub" onClick={() => { swapPage(uiduser) }}>
                            <img
                                alt="Imge"
                                src={userProfile}
                                className=" max-w-40-px rounded-full border image position-left-head cursor-allowed"
                            />
                            <div className="mt-2">
                                <label className="cursor-allowed color-black font-name-head ">
                                    {owner}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="followshow ml-5">
                        <FollowButton />
                    </div>
                    <div className="mt-3 color-black" >
                        <EditUserButton title={title} caption={caption} hastag={tagImage_} uiduser={uiduser} />
                    </div>
                </div>
                <div className="mt-5">
                    <img
                        alt="..."
                        src={image}
                        loading="lazy"
                        className=" max-w-800-px  max-h-500-px"
                    />
                </div>
                <div className="box-showimage-detail">
                    <div>
                        <LikeButton tagImage={tagImage_} tagLog={tagLog_} />
                    </div>

                </div>
                <div className="box-detail color-black">
                    <h2 className="font-name-head">Title : {title}</h2>
                    <h3 className="font-name">Caption : {caption}</h3>
                    <label className="label-14 mt-2 color-gray-time">{date}</label>
                </div>
                <Comment />
                <ShowComments />
            </div>
        </div>
    </Fragment>
}
export default ShowImage;
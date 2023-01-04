import React, { useContext, useEffect, useState } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { app } from '../../firebase';
import { AuthContext } from '../auth/Auth';
import { firebase } from '../../firebase';

export default function FollowButton() {

    const [uiduser, setUidUser] = useState();
    const [follow, setFollow] = useState([]);
    const { id } = useParams();
    const history = useHistory();

    const { currentUser } = useContext(AuthContext);

    const currentUserId = currentUser ? currentUser.uid : null;

    useEffect(() => {
        var uid
        const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
            const docRefImage = app.firestore().collection("Image").doc(id);
            docRefImage.get().then((doc) => {
                if (doc.exists) {
                    var docId = doc.data().uid
                    setUidUser(docId.toString());
                    uid = docId.toString();
                    const docRef = app.firestore().collection("Users").doc(uid);
                    docRef.get().then((doc) => {
                        if (doc.exists) {
                            var followuser = doc.data().follower
                            setFollow(followuser);
                        } else history.push("/error404")
                    }).catch((error) => {
                        console.log("error")
                    });

                } else history.push("/error404")
            }).catch((error) => {
                console.log("error")
            })
        }, 500)
        return () => clearInterval(intervalId); //This is important
    })

    const followhandler = (event) => {
        event.preventDefault();
        try {
            const checkLike = follow.filter(value => value === currentUserId)
            if (checkLike[0] === currentUserId) {
                var Follower = app
                    .firestore()
                    .collection("Users")
                    .doc(uiduser);
                Follower.update({
                    follower: firebase.firestore.FieldValue.arrayRemove(currentUserId),
                })
                var FollowAlreadys = app
                    .firestore()
                    .collection("Users")
                    .doc(currentUserId);

                FollowAlreadys.update({
                    following: firebase.firestore.FieldValue.arrayRemove(uiduser),
                })
            } else {
                var Following = app.firestore()
                    .collection("Users")
                    .doc(currentUserId);

                Following.update({
                    following: firebase.firestore.FieldValue.arrayUnion(uiduser),
                })

                var Follow = app
                    .firestore()
                    .collection("Users")
                    .doc(uiduser);

                Follow.update({
                    follower: firebase.firestore.FieldValue.arrayUnion(currentUserId),
                })
            }
        } catch (err) { }
    }

    const checkFollow = follow.filter(value => value === currentUserId)

    if (currentUserId === uiduser) return <></>
    if (currentUserId === checkFollow[0]) return <>
        <div onClick={followhandler} >
            <button>following</button>
        </div>
    </>
    else return <>
        <div onClick={followhandler} >
            <button>+follow</button>
        </div>
    </>
}
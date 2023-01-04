import React, { useContext, useEffect, useState } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { app } from '../../firebase';
import { AuthContext } from '../auth/Auth';
import { firebase } from '../../firebase';

export default function FollowButtonProfile() {

    const [follow, setFollow] = useState([]);
    const { id } = useParams();
    const history = useHistory();


    const { currentUser } = useContext(AuthContext);

    const currentUserId = currentUser ? currentUser.uid : null;

    /////////////////////////////////////////////////////////////////

    useEffect(() => {
      
        const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
             const docRef = app.firestore().collection("Users").doc(id);
                    docRef.get().then((doc) => {
                        if (doc.exists) {
                            var followuser = doc.data().follower
                            setFollow(followuser);
                        } else {
                            history.push("/error404")
                        }
                    }).catch((error) => {
                        console.log("error")
                    });

        }, 500)

        return () => clearInterval(intervalId); //This is important

    })
    //////////////////////////////////////////////////////////////////////////



    const followhandler = (event) => {
        event.preventDefault();
        
        try {

            const checkLike = follow.filter(value => value === currentUserId)


            if (checkLike[0] === currentUserId) {
                var Follower = app
                    .firestore()
                    .collection("Users")
                    .doc(id);
                Follower.update({
                    follower: firebase.firestore.FieldValue.arrayRemove(currentUserId),

                })
                var FollowAlreadys = app
                    .firestore()
                    .collection("Users")
                    .doc(currentUserId);

                FollowAlreadys.update({
                    following: firebase.firestore.FieldValue.arrayRemove(id),

                }

                )


            } else {
                var Following = app
                    .firestore()
                    .collection("Users")
                    .doc(currentUserId);

                Following.update({
                    following: firebase.firestore.FieldValue.arrayUnion(id),

                })
                var Follow = app
                    .firestore()
                    .collection("Users")
                    .doc(id);

                Follow.update({
                    follower: firebase.firestore.FieldValue.arrayUnion(currentUserId),

                })


            }
        } catch (err) { }

    }

    const checkLike = follow.filter(value => value === currentUserId)

    if(currentUserId===id){
        return(
            <>
            </>
        )
    }
    if(currentUserId===checkLike[0]){
        return (
            <>
    
                <div onClick={followhandler} >
                    <button>following</button>
                </div>
    
            </>
        );
    }
    else{
        return (
            <>
    
                <div onClick={followhandler} >
                    <button>+follow</button>
                </div>
    
            </>
        );
    }
   
}
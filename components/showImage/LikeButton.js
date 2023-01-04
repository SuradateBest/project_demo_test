/* eslint-disable array-callback-return */
import React, { useContext, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useHistory, useParams } from "react-router-dom";
import { app } from "../../firebase";
import { AuthContext } from "../auth/Auth";
import { firebase } from "../../firebase";

export default function LikeButton({ tagImage, tagLog }) {

  const [docId, setDocId] = useState();
  const [likeuser, setUser] = useState([]);
  const { id } = useParams();
  const history = useHistory();
  const [count, setCountLike] = useState(0);

  const { currentUser } = useContext(AuthContext);

  const currentUserId = currentUser ? currentUser.uid : null;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const docRefImage = app.firestore().collection("Image").doc(id);
      docRefImage.get().then((doc) => {
        if (doc.exists) {
          var docId = doc.id;
          var countLike = doc.data().Like;
          var likeUser = doc.data().Likeuser;

          setUser(likeUser);
          setCountLike(countLike);
          setDocId(docId.toString());

        } else history.push("/error404");
      }).catch((error) => {
        console.log(error);
      });
    }, 500);
    return () => clearInterval(intervalId);
  });

  async function updateLike(amount) {
    var testLog = tagLog
    tagImage.map(value => {
      tagLog.map((value1, key) => {
        if (value1.tagName === value) testLog[key].like += parseInt(amount)
      })
    })

    const docRefLog = app.firestore().collection("Log").doc(currentUserId)
    docRefLog.set({
      tag: testLog
    })
  }

  const likeHandler = async (event) => {
    event.preventDefault();
    try {
      const checkLike = likeuser.filter((value) => value === currentUserId)
      if (checkLike[0] === currentUserId) {
        await updateLike(-1)
        var ImageLikealreadys = app.firestore().collection("Image").doc(docId);

        ImageLikealreadys.update({
          Likeuser: firebase.firestore.FieldValue.arrayRemove(currentUserId),
          Like: count - 1,
        });
      } else {
        await updateLike(1)
        var ImageLike = app.firestore().collection("Image").doc(docId);

        ImageLike.update({
          Likeuser: firebase.firestore.FieldValue.arrayUnion(currentUserId),
          Like: count + 1,
        });
      }
    } catch (err) { }
  };

  const checkLike = likeuser.filter((value) => value === currentUserId);

  if (checkLike[0] === currentUserId) {
    return <>
      <div className="position-left mt-5 cursor-allowed">
        <FaHeart
          className="padding-right-10 color-red padding-left-40"
          onClick={likeHandler}
          size="20px"
        />
        {count}
      </div>
    </>
  } else {
    return <>
      <div className="position-left mt-5 cursor-allowed">
        <div className="showimage-sub">
          <FaHeart
            className="padding-right-10 color-gray padding-left-40"
            onClick={likeHandler}
            size="30px"
          />
          <div className="mt-1">
            <span className="margin-left-10 " >
              {count}
            </span>
          </div>
        </div>
      </div>
    </>
  }
}

import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { useUser } from "../../auth/useUser";
import { app } from "../../firebase";
import { AuthContext } from "../auth/Auth";
import NavbarBan from "../navbar/NavBanpage/NavBan";
import "../BanPage/banpage.css"

const BanPage = () => {
  const { logout } = useUser();
  const [gotban, setGotBan] = useState();
  const { currentUser } = useContext(AuthContext);
  const currentUserId = currentUser ? currentUser.uid : null;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const docRef = app.firestore().collection("Users").doc(currentUserId)
      docRef.get().then((doc) => {
        if (doc.exists) setGotBan(doc.data().Gotban);
        else console.log("No such document!");
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    }, 500)
    return () => clearInterval(intervalId);
  })

  let ban = gotban;
  if (!currentUser) return <Redirect to="/" />;
  if (currentUser && (ban === false)) return <Redirect to="/home" />

  return <>
    <NavbarBan />
    <div className="container-ban">
      <div className="text-center">
      <h1 className="font-name">You got ban!</h1>
      <h3 className="font-name">Please sign out</h3>
      <button onClick={() => { logout() }} className="cursor-allowed font-name">Sign out</button>
      </div>
    </div>
  </>
};

export default BanPage;

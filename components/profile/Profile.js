import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../auth/Auth";
import { Redirect, useHistory } from "react-router-dom";
import NavbarArtist from "../navbar/navuser/NavbarArtist";
import { app } from "../../firebase";
import FollowButtonProfile from "./FollowButtonProfile";
import EditButton from "./EditButton";
import BannerProfile from "../header/headerprofile";
import "../profile/profile.css"
import { Card } from "react-bootstrap";

const Profile = () => {
  const { id } = useParams();
  const [userProfile, setProfile] = useState("");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [userDetail, setDetail] = useState("");
  const [posts, setPosts] = useState([]);
  const [type, setType] = useState("");
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);

  /////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const docRefUser = app.firestore().collection("Users").doc(id);
    docRefUser
      .get()
      .then((doc) => {
        if (doc.exists) {
          var Name = doc.data().Name;
          var Detail = doc.data().Detail;
          var ProfileImg = doc.data().ProfileImg;
          var type = doc.data().Role;
          setType(type.toString())
          setName(Name.toString());
          setDetail(Detail.toString());
          setProfile(ProfileImg.toString());
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  });
  /////////////////////////////////////////////////////////////////////////////////////
  useEffect(
    () => {
      const getPostsFromFirebase = [];

      const show = app
        .firestore()
        .collection("Image")
        .where("UserImage", "==", name)
        .orderBy("Datetime", "desc")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            getPostsFromFirebase.push({
              ...doc.data(),
              key: doc.id,
            });
          });
          setPosts(getPostsFromFirebase);
          setLoading(false);
        });

      return () => show();
    },
    [name],
    [loading]
  );
  /////////////////////////////////////////////////////////////////////////////////////////

  const swapPage = (id) => {
    history.push(`/showimage/${id}`);
  };

  if (!currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <NavbarArtist role={type} />
      <BannerProfile />
      <div className="container">
        <div className="box-profile">
          <div className="mt-3">
            <div className="grid-con">

              <img
                alt="Imge"
                src={userProfile}
                className=" max-w-150-px rounded-full border image"
              />


              <div className="follow mt-3 color-black" >
                <label id="name" className="font-name-com ">Name : {name}
                </label><br /><br />
                <span className="font-title1">About me :</span><br></br>
                <span> {userDetail}</span>

              </div>
              <div className="followpf mt-1">
                <FollowButtonProfile />
              </div>
              <div className="margin-left-40">
                <EditButton name={name} detail={userDetail} image={userProfile} />
              </div>
            </div>


          </div>
          <div className="box-profile-2 ">
            <div className="container-card font-link color-black">
              <h2>Work piece :</h2>
            </div>
            <div className="profile-grid">
              {posts.length > 0 ? (
                posts.map(function (post) {
                  return <React.Fragment key={post.key}>

                    <Card
                      style={{ width: "200px" }}
                      onClick={() => { swapPage(post.key) }}
                    >
                      <Card.Img className="radius cursor-allowed opacity-1"
                        src={post.Img}
                        width="200"
                        height="250"
                        variant="top"
                        alt="" />

                      <Card.Body  >
                        <Card.Title className="color-black font-title">
                          <span> Title : {post.Title}</span>
                        </Card.Title>
                        <Card.Text className="label-14 mt-2 color-gray-time">
                          <span> {post.Datetime}</span>
                        </Card.Text>
                      </Card.Body>

                    </Card>
                  </React.Fragment>
                })
              ) : (
                <label>You not have art yet</label>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

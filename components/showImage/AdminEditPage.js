import { useContext, useEffect, useState } from "react";
import { useHistory, useParams, Redirect } from "react-router-dom";
import { app } from "../../firebase";
import 'firebase/firestore';
import { AuthContext } from "../auth/Auth";
import NavbarArtist from "../navbar/navuser/NavbarArtist";
import dateTime from "date-time";
import BannerEditimage from "../header/headereditimg";
import Swal from "sweetalert2";
import { delayMiliSecond } from "../../util/delay";
import InputHastag from "../upLoadPage/hastagInout";

const AdminEditImage = () => {
    const { id, Hastag } = useParams();
    var a = Hastag.split("_")
    for (let i = 0; i < a.length; i++) {
        a[i] = "#" + a[i]
    }
    const [tags, setTags] = useState(a)
    const history = useHistory();
    const [addtype] = useState(["Art", "Photo", "Sculpture"])
    const [type, setRole] = useState('Art')
    const [typeAdmin, setType] = useState("");
    const [image, setImage] = useState("");
    const { currentUser } = useContext(AuthContext);
    const currentUserId = currentUser ? currentUser.uid : null;
    const Add = addtype.map(Add => Add)

    const handleAddTypeChange = (e) => {
        setRole(addtype[e.target.value])
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            const docRef = app.firestore().collection("Image").doc(id)
            docRef.get().then((doc) => {
                if (doc.exists) {
                    setImage(doc.data().Img.toString());
                    setType(doc.data().Role.toString());
                }
                else console.log("No such document!");
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }, 500)
        return () => clearInterval(intervalId);
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


    const submitHandler = (event) => {
        event.preventDefault();
        if (tags.length === 0) {
            Swal.fire({
                title: "You forgot hastag",
                text: "You must put hastag",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
            })
        } else {
            app.firestore()
                .collection("Image")
                .doc(id)
                .update({
                    Type: type,
                    tag: tags,
                    Datetime: dateTime({ showTimeZone: false }),
                }).then(function () {
                    history.push("/home");
                }).catch((error) => {
                    console.log(error)
                })
        }
    }
    const deleteImage = (keyid) => {
        Swal.fire({
            key: keyid,
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await app.firestore()
                    .collection("Image")
                    .doc(keyid)
                    .delete()
                    .then(async () => {
                        await Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success",
                            timer: 1000,
                            showConfirmButton: false
                        });
                        await delayMiliSecond(1200)
                        await history.push("/home");
                    });
            }
        });
    };

    if (!currentUser) return <Redirect to="/" />;

    if (currentUserId !== "Kp327DuvbVY9RAuMKsSVM25fm472") {
        history.push("/home")
    }

    return <div>
        <NavbarArtist role={typeAdmin} />
        <BannerEditimage />
        <div className="grid-uploadpage">

            <div className="box-4-admin-image">
                <div className="text-center header font-name">
                    <span>Image</span>
                </div>
                <div className="paddingleft-right mt-3">
                    <img
                        alt="..."
                        src={image}
                        className="mx-auto max-w-full "
                    />
                </div>
            </div>
            <div className="box-4-admin mt-3">
                <label>Hastags</label>
                <InputHastag setTags={setTags} tags={tags}
                />
                <label>Type</label>
                <div className="mt-3">
                    <select
                        onChange={e => handleAddTypeChange(e)}
                        className="select-type-admin" >
                        {Add.map((address, key) =>
                            <option
                                key={key}
                                value={key}>
                                {address}
                            </option>
                        )}
                    </select >
                </div>
                <div className="button-grid">
                    <div>
                        <form onSubmit={submitHandler} method="POST">
                            <div >
                                <button type="submit"
                                    className="button-isable-img"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                    <button onClick={() => { deleteImage(id) }}
                        type="submit"
                        className="button-delete1"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
}

export default AdminEditImage;
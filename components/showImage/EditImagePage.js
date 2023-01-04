import { useContext, useEffect, useState } from "react";
import { useHistory, useParams, Redirect } from "react-router-dom";
import { app } from "../../firebase";
import 'firebase/firestore';
import { AuthContext } from "../auth/Auth";
import NavbarArtist from "../navbar/navuser/NavbarArtist";
import dateTime from "date-time";
import BannerEditimage from "../header/headereditimg";
import InputHastag from "../upLoadPage/hastagInout";
import Swal from "sweetalert2";
import { delayMiliSecond } from "../../util/delay";

const EditImage = () => {
    const { id, title, caption, Hastag } = useParams();
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
    const [disable, setDisable] = useState(false);
    const [state, setState] = useState({
        Title: title,
        Caption: caption,
        Hastag: Hastag,
    });
    const { currentUser } = useContext(AuthContext);
    const currentUserId = currentUser ? currentUser.uid : null;
    const Add = addtype.map(Add => Add)

    const handleAddTypeChange = (e) => {
        setRole(addtype[e.target.value])
    }

    var box = document.getElementById('caption');
    var charlimit = 28; // char limit per line
    var space;
    function checklenght() {
        var lines = box.value.split('\n');
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].length <= charlimit) continue;
            var j = 0; space = charlimit;
            while (j++ <= charlimit) {
                if (lines[i].charAt(j) === ' ') space = j;
            }
            lines[i + 1] = lines[i].substring(space + 1) + (lines[i + 1] || "");
            lines[i] = lines[i].substring(0, space);
        }
        box.value = lines.slice(0, 10).join('\n');
    };
    //////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        const intervalId = setInterval(() => {
            const docRef = app.firestore().collection("Image").doc(id)
            docRef.get().then((doc) => {
                if (doc.exists) {
                    setImage(doc.data().Img.toString())

                }
                else console.log("No such document!");
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }, 500)
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

    function onInputChange(event) {
        const { name, value } = event.target

        setState((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
        if (state.Title === "" || state.Caption === "")
            setDisable(true)
        else setDisable(false)
    }

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
                    Title: state.Title,
                    Caption: state.Caption,
                    Type: type,
                    Datetime: dateTime({ showTimeZone: false }),
                    tag: tags
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


    return <div>
        <NavbarArtist role={typeAdmin} />
        <BannerEditimage />
        <div className="container">
            <div className="grid-uploadpage">
                <div className="box-4">
                    <div className="text-center header font-name">
                        <span>Image</span>
                    </div>
                    <div className="paddingleft-right">
                        <img
                            alt="..."
                            src={image}
                            className="mx-auto max-w-full "
                        />
                    </div>
                </div>
                <div className="box-4-edit mt-3">
                    <div className="color-black">
                        <label >
                            Title
                        </label>
                        <input type="text"
                            id="Title"
                            name="Title"
                            value={state.Title}
                            onChange={onInputChange}
                            placeholder="Title"
                            className="mt-5" >
                        </input>
                        <label>Caption</label>
                        <textarea row="3"
                            id="caption"
                            type="text"
                            name="Caption"
                            value={state.Caption}
                            onChange={onInputChange}
                            onKeyUp={checklenght}
                            placeholder="28 character per line"
                            className="mt-5"
                        />
                        <label>Hastags</label>
                        <InputHastag setTags={setTags} tags={tags}
                        />
                        <label>Type</label>
                    </div>
                    <div className="mt-3">
                        <select
                            onChange={e => handleAddTypeChange(e)}
                            className="select-type-edit" >
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
                                    <button
                                        className={disable ? "button-disable-img " : "button-isable-img"}
                                        type="submit "
                                        disabled={disable}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                        <button onClick={() => { deleteImage(id) }}
                            type="submit"
                            className="button-delete"
                        >
                            Delete
                        </button>

                    </div>
                </div>

            </div>
        </div>
    </div>
}

export default EditImage;
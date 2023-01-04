import { Fragment, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { useUser } from "../../auth/useUser";
import { app } from "../../firebase";
import 'firebase/firestore';
import useInput from "../hooks/input";
import Navbar from "../navbar/navlogin/Navauth";
import Uploadimg from "../Uploadimg/uploadimg";
import { AuthContext } from "./Auth";
import { doesUsernameExist } from "../../service/firebase";
import "../auth/auth.css"

const RegisterDetail = () => {
    const { user } = useUser();
    const [error, setError] = useState("");
    const [profile, setProfile] = useState("https://firebasestorage.googleapis.com/v0/b/react-project-7899e.appspot.com/o/default.jpg?alt=media&token=ae4c3170-4473-433f-8da4-8c260df848b3");
    const history = useHistory();

    const { currentUser } = useContext(AuthContext);

    const email = currentUser.email;
    const isNotEmpty = (value) => value.trim() !== "";

    const {
        value: Name,
        isValid: enteredNameIsValid,
        hasError: nameInputError,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
    } = useInput(isNotEmpty);

    const {
        value: enteredDetails,
        valueChangeHandler: detailsChangeHandler
    } = useInput(() => { });

    let formIsValid = false;
    if (enteredNameIsValid) formIsValid = true;

    const userInputClasses = nameInputError
        ? "block uppercase text-red-500 "
        : "block uppercase    ";

    const formClassname = formIsValid
        ? "button-6"
        : " button-5  rounded shadow outline-none focus:outline-none  transition-all duration-150 ";

    const [addtype] = useState(["Artist", "Viewer"])
    const Add = addtype.map(Add => Add)
    const handleAddTypeChange = (e) => {
        console.clear();
        console.log((addtype[e.target.value]));
        setRole(addtype[e.target.value])
    }

    const [role, setRole] = useState('Artist')

    const imgUploadHandler = (img) => {
        setProfile(img);
    };

    const submitHandler = async (event) => {
        event.preventDefault();

        const usernameExists = await doesUsernameExist(Name);
        if (!usernameExists.length) {
            try {
                await app.firestore()
                    .collection("Users")
                    .doc(user.id)
                    .set({
                        Name: Name,
                        Email: email,
                        Detail: enteredDetails,
                        Role: role,
                        ProfileImg: profile,
                        follower: [],
                        following: [],
                        Gotban: false,
                    });
                await app.firestore()
                    .collection("Log")
                    .doc(user.id)
                    .set({
                        tag: [],

                    });
                history.push('/');
            } catch (error) { }
        } else setError("That username is alreadys taken , please try another.");
    }

    var box = document.getElementById('detail');
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

    return <Fragment>
        <Navbar />
        <div className="container">
            <div className="background-detail">
                <div className="box-2-login">
                    <div className="mb-5">
                        <h1 className="text-center mt-0 font-link">Your Detail</h1>
                    </div>
                    <div className="mb-6">
                        <div className="">
                            <img
                                alt="..."
                                src={profile}
                                className=" max-w-100-px rounded-full border"
                            />
                        </div>
                    </div>
                    <form onSubmit={submitHandler} id="Signup-form" method="POST">
                        <div className="position-center-ed">
                            <Uploadimg imgUpload={imgUploadHandler} className="mt-5 " />
                        </div>
                        <div className=" mt-3">
                            <label className={userInputClasses}>
                                Name:
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={Name}
                                onChange={nameChangeHandler}
                                onBlur={nameBlurHandler}
                                placeholder=" 20 Max character"
                                maxLength="20"
                                className="mt-5" />
                            <div className="mt-3">
                                <label>About You:</label>
                                <textarea row="5"
                                    id="detail"
                                    value={enteredDetails}
                                    type="text"
                                    onChange={detailsChangeHandler}
                                    placeholder="Everything you want people to know"
                                    className="mt-5"
                                    style={{ height: "100px", width: "300px" }}
                                    onKeyUp={checklenght} />
                            </div>
                            <div className="mt-3">
                                <label>Type</label>
                            </div>
                            <div className="mt-3">
                                <select
                                    onChange={e => handleAddTypeChange(e)}
                                    className="browser-default custom-select">
                                    {Add.map((address, key) =>
                                        <option
                                            key={key}
                                            value={key}>
                                            {address}
                                        </option>
                                    )}
                                </select>
                            </div>
                            <div className="mt-3 button-center " >
                                <button
                                    type="submit "
                                    className={formClassname}
                                    disabled={!formIsValid}>
                                    Submit
                                </button>
                                <label className="error text-red text-size-16">{error}</label>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Fragment>

}

export default RegisterDetail;
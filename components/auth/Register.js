import { Fragment, useContext } from "react"
import { Redirect } from "react-router-dom";
import Navbar from "../navbar/navlogin/Navauth";
import useInput from "../hooks/input";
import { AuthContext } from "./Auth";
import { app } from "../../firebase";

const Register = () => {
    const isNotEmpty = (value) => value.trim() !== "";
    const isEmail = (value) => value.includes("@");

    const Signup = document.querySelector('#Signup-form');

    const submitHandler = (event) => {
        event.preventDefault();
        app.auth()
            .createUserWithEmailAndPassword(email, enteredPassword)
            .then(() => {
                Signup.reset();
                Signup.querySelector('.eror').innerHTML = '';
                <Redirect to="/register/detail" />
            }).catch((error) => {
                Signup.querySelector('.error').innerHTML = error.message;
            });
    }

    const {
        value: email,
        isValid: enteredEmailIsValid,
        hasError: emailInputError,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
    } = useInput(isEmail);

    const {
        value: enteredPassword,
        isValid: enteredPasswordIsValid,
        hasError: passInputError,
        valueChangeHandler: passChangeHandler,
        inputBlurHandler: passBlurHandler,
    } = useInput(isNotEmpty);

    const {
        value: enteredRePassword,
        isValid: enteredRePasswordIsValid,
        valueChangeHandler: rePassChangeHandler,
        inputBlurHandler: rePassBlurHandler,
    } = useInput(isNotEmpty);

    let formIsValid = false;

    if (
        enteredEmailIsValid &&
        enteredPasswordIsValid &&
        enteredRePasswordIsValid &&
        enteredPassword === enteredRePassword
    ) formIsValid = true;

    const { currentUser } = useContext(AuthContext);
    if (currentUser) return <Redirect to="/register/detail" />

    const emailInputClasses = emailInputError
        ? "block uppercase text-red-500  "
        : "block uppercase    ";

    const passInputClasses = passInputError
        ? "block uppercase text-red-500 "
        : "block uppercase    ";

    const rePassInputClasses =
        enteredPassword !== enteredRePassword
            ? "block uppercase text-red-500   "
            : "block uppercase    ";

    const formClassname = formIsValid
        ? "button-6 "
        : " button-5 rounded shadow outline-none focus:outline-none  transition-all duration-150 cursor-not-allowed";

    return <Fragment>
        <Navbar />
        <div className="container">
            <div className="background-regis">
                <div className="box-1-regis ">
                    <h1 className="text-center mt-3 font-link">Create Account</h1>
                    <form onSubmit={submitHandler} id="Signup-form" method="POST">
                        <div className="mt-5">
                            <label className={emailInputClasses}>
                                Email:
                            </label>
                        </div>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={emailChangeHandler}
                            onBlur={emailBlurHandler}
                            placeholder="Enter-email"
                            className="mt-5" />
                        <div className="mt-3">
                            <label className={passInputClasses}>
                                Password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter-password"
                                value={enteredPassword}
                                onChange={passChangeHandler}
                                onClick={passBlurHandler}
                                className="mt-5" />
                        </div>
                        <div className="mt-3">
                            <label className={rePassInputClasses}>
                                Confirm Password:
                            </label>
                            <input
                                type="password"
                                id="repassword"
                                value={enteredRePassword}
                                onChange={rePassChangeHandler}
                                onBlur={rePassBlurHandler}
                                placeholder="Confirm-password"
                                className="mt-5" />
                            <label className="error text-red text-size-16" />
                        </div>
                        <div className="mt-3 button-center">
                            <button
                                type="Submit "
                                className={formClassname}
                                disabled={!formIsValid}
                            >
                                Next
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Fragment>
}

export default Register;
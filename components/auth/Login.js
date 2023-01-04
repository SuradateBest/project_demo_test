
import React, { Fragment, useContext } from "react";
import { app } from "../../firebase";
import Navbar from "../navbar/navlogin/Navauth";
import { Link, Redirect } from "react-router-dom";
import useInput from "../hooks/input";
import { AuthContext } from "./Auth";
import "../../assets/style/background.css"

const Login = () => {
    const isNotEmpty = (value) => value.trim() !== "";
    const isEmail = (value) => value.includes("@");

    const {
        value: email,
        isValid: emailIsValid,
        hasError: emailInputError,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
    } = useInput(isEmail);

    const {
        value: password,
        isValid: passwordIsValid,
        hasError: passInputError,
        valueChangeHandler: passChangeHandler,
        inputBlurHandler: passBlurHandler,
    } = useInput(isNotEmpty);

    const loginform = document.querySelector('#login-form');

    const submitHandler = (event) => {
        event.preventDefault();

        app.auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                loginform.reset();
                loginform.querySelector('.eror').innerHTML = '';
            })
            .catch((error) => {
                loginform.querySelector('.error').innerHTML = error.message;
            });
    }

    const { currentUser } = useContext(AuthContext);
    if (currentUser) return <Redirect to="/home" />

    let formIsValid = false;
    if (emailIsValid && passwordIsValid) formIsValid = true;

    const emailInputClasses = emailInputError
        ? "block uppercase text-red-500 text-xs  "
        : "block uppercase  text-xs  ";

    const passInputClasses = passInputError
        ? "block uppercase text-red-500 text-xs  "
        : "block uppercase  text-xs  ";

    const submitButtonClasses = formIsValid
        ? " button-6 "
        : " button-5  rounded shadow outline-none focus:outline-none  transition-all duration-150 ";

    return <Fragment>
        <Navbar />
        <div className="container ">
            <div className="background-auth">
                <div className="box-2-login ">
                    <h1 className="text-center font-link">Sign in</h1>
                    <form onSubmit={submitHandler} id="login-form" method="POST">
                        <div className="mt-8">
                            <label className={emailInputClasses}>
                                Email:
                            </label>
                            <input type="email"
                                id="email"
                                value={email}
                                onChange={emailChangeHandler}
                                onBlur={emailBlurHandler}
                                placeholder="Enter-email"
                                className="mt-3"
                            />
                            <div className="mt-3">
                                <label className={passInputClasses}>
                                    Password:
                                </label>
                                <label className="error text-red text-size-16" />
                                <input type="password"
                                    id="password"
                                    value={password}
                                    onChange={passChangeHandler}
                                    onBlur={passBlurHandler}
                                    placeholder="Enter-password"
                                    className="mt-3"
                                />
                            </div>
                            <div className="mt-5 button-center">
                                <button
                                    type="submit "
                                    className={submitButtonClasses}
                                    disabled={!formIsValid}
                                >
                                    Submit
                                </button>
                                <Link to="/register">
                                    <label className="color-black"> Create</label>
                                    <label className="text-color-blue cursor-allowed" > account?</label>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Fragment>
}
export default Login;
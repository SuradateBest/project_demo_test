import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/database";
import 'firebase/firestore';

import config from "./config";

export const app = firebase.initializeApp(config);

const { FieldValue } = firebase.firestore;

export { firebase, FieldValue };
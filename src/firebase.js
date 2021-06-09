import firebase from "firebase/app";
import "firebase/firestore";
import configData from "./config/default.json";

const firebaseConfig = {
    apiKey: configData.API_KEY,
    authDomain: configData.AUTH_DOMAIN,
    databaseURL: configData.DATABASE_URL,
    projectId: configData.PROJECT_ID,
    storageBucket: configData.STORAGE_BUCKET,
    messagingSenderId: configData.MESSAGE_SENDER_ID,
    appId: configData.APP_ID,
    measurementId: configData.MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

export default firebase;

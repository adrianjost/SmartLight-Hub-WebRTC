export const config = {
	apiKey: "AIzaSyDJ17cuZ4P1YzSTOWtU_WqOKMloaqg7x_Q",
	authDomain: "smartlight-4861d.firebaseapp.com",
	databaseURL: "https://smartlight-4861d.firebaseio.com",
	projectId: "smartlight-4861d",
	storageBucket: "smartlight-4861d.appspot.com",
	messagingSenderId: "535232876187",
	appId: "1:535232876187:web:d1d32ada292db2bb3c803e"
};

import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// initialize if not already done
try {
	firebase.initializeApp(config);
} catch (error) {
	console.warn("firebase already initialized", error);
}

export { firebase };
export const FAuth = firebase.auth();
export const FStore = firebase.firestore();

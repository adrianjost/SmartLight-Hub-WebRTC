import { firebase, FAuth } from "./firebase";
import * as firebaseui from "firebaseui";

import eventbus from "./eventbus";

export default () => {
	const ui = new firebaseui.auth.AuthUI(FAuth);
	ui.start("#firebaseui-auth-container", {
		signInSuccessUrl: "/",
		signInOptions: [
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
			firebase.auth.GithubAuthProvider.PROVIDER_ID,
			firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
		]
	});
	return ui;
};

FAuth.onAuthStateChanged(user => {
	if (user) {
		eventbus.send("loggedIn", user);
	} else {
		eventbus.send("loggedOut", user);
	}
});

eventbus.on("logout", () => {
	FAuth.signOut();
});

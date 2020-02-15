import eventbus from "./eventbus";
import authenticate from "./auth";
import store from "./store";

const loginForm = document.getElementById("loginform");
const hubUi = document.getElementById("hub-ui");
const logList = document.getElementById("logs");

let authUi;

eventbus.on("loggedIn", (user) => {
	loginForm.classList.add("hidden");
	hubUi.classList.remove("hidden");
	if (authUi) {
		authUi.delete();
	}
	store.user = user
});

eventbus.on("loggedOut", () => {
	loginForm.classList.remove("hidden");
	hubUi.classList.add("hidden");
	authUi = authenticate();
	delete store.user
});

const BtnLogout = document.getElementById("logout");
BtnLogout.addEventListener("click", () => {
	eventbus.send("logout");
});

eventbus.on("message", message => {
	const textNode = document.createElement("p");
	textNode.innerText = `${new Date().toLocaleTimeString()}: ${message}`
	logList.prepend(textNode);
});

const BtnCreateClient = document.getElementById("create-client")
BtnCreateClient.addEventListener("click", () => {
	eventbus.send("createClient")
})

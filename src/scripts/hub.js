import Peer from "simple-peer";
import eventbus from "./eventbus";
import { FStore } from "./firebase";

const handledSignals = {}

eventbus.on("loggedIn", ({ uid }) => {
	const signalsRef = FStore.collection("signals").where("created_by", "==", uid);

	signalsRef.onSnapshot((querySnapshot) => {
		const signals = [];
		querySnapshot.forEach((doc) => {
			signals.push({
				id: doc.id,
				...doc.data()
			});
		});
		signals.filter((signal) =>
			!handledSignals[signal.id]
			&& !signal.hub
		).forEach((signalData) => {
			const clientSignal = JSON.parse(signalData.client)

			const peer = new Peer({ trickle: false });
			peer.on("error", console.error);
			peer.on("signal", data => {
				FStore.collection("signals").doc(signalData.id).set(
					{
						created_by: uid,
						updated_by: uid,
						hub: JSON.stringify(data)
					},
					{ merge: true }
				);
			});
			peer.on("connect", () => {
				delete handledSignals[signal.id]
			});
			peer.on("data", data => {
				console.log(`⏩: "${data.toString()}"`);
				eventbus.send("message", data)
			});

			handledSignals[signalData.id] = true;
			peer.signal(clientSignal);
		})
	});
});

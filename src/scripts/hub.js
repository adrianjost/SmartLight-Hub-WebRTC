import Peer from "simple-peer";
import eventbus from "./eventbus";
import store from "./store";
import { FStore } from "./firebase";
import Connection from "./connection";

const handledSignals = {};

eventbus.on("startHub", () => {
	const uid = store.user.uid;
	const signalsRef = FStore.collection("signals").where(
		"created_by",
		"==",
		uid
	);

	signalsRef.onSnapshot(querySnapshot => {
		const signals = [];
		querySnapshot.forEach(doc => {
			signals.push({
				id: doc.id,
				...doc.data()
			});
		});
		signals
			.filter(signal => !handledSignals[signal.id] && !signal.hub)
			.forEach(signalData => {
				const clientSignal = JSON.parse(signalData.client);

				const peer = new Peer({ trickle: false });
				peer.on("error", console.error);
				peer.on("signal", data => {
					FStore.collection("signals")
						.doc(signalData.id)
						.set(
							{
								created_by: uid,
								updated_by: uid,
								hub: JSON.stringify(data)
							},
							{ merge: true }
						);
				});
				peer.on("connect", () => {
					delete handledSignals[signalData.id];
				});
				peer.on("data", dataBuffer => {
					const data = JSON.parse(dataBuffer.toString());

					console.log(`⏩: `, data);
					eventbus.send("message", JSON.stringify(data));

					new Connection([data.ip, data.hostname])[data.method](
						...(data.payload || [])
					);
				});

				handledSignals[signalData.id] = true;
				peer.signal(clientSignal);
			});
	});
});

import Peer from "simple-peer";
import eventbus from "./eventbus";
import store from "./store";
import { FStore } from "./firebase";

/**
 * Client
 */

eventbus.on("createClient", () => {
	const signalsRef = FStore.collection("signals");

	const peer = new Peer({ initiator: true, trickle: false });
	peer.on("error", console.error);
	peer.on("signal", data => {
		const newDoc = {
			created_by: store.user.uid,
			updated_by: store.user.uid,
			client: JSON.stringify(data)
		};
		signalsRef.add(newDoc).then(docRef => {
			const unsubscribe = docRef.onSnapshot(docSnap => {
				const { hub: hubSignal } = docSnap.data();
				if (!hubSignal) {
					return;
				}
				peer.signal(JSON.parse(hubSignal));
				unsubscribe();
				docRef.delete();
			});
		});
	});
	peer.on("connect", () => {
		// send demo data
		window.addEventListener(
			"mousemove",
			event => {
				peer.send(
					JSON.stringify({
						ip: "192.168.1.233",
						hostname: "sl-wwcw",
						method: "send",
						payload: [
							{
								color: {
									"1": event.x % 255,
									"2": event.y % 255,
									"3": (event.x + event.y) % 255
								}
							}
						]
					})
				);
			},
			{ passive: true }
		);
	});
});

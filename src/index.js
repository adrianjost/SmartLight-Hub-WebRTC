import Peer from "simple-peer"
import db from "./eventbus"

/**
 * HUB
 */
const clientSignals = {}
const hubSignals = {};
const signals = {}

db.on("clientSignalsChanged", () => {
	const waitingClients = Object.keys(clientSignals);
	waitingClients.forEach(clientId => {
		const peer = new Peer({trickle: false});
		peer.on('error', console.error)
		peer.on('signal', data => {
			hubSignals[clientId] = JSON.stringify(data)
			db.send("hubSignalsChanged")
		})
		peer.on('connect', () => { console.log(clientId, 'HUB CONNECT') })
		peer.on('data', data => { console.log(`⏩ (${clientId}): "${data.toString()}"` ) })

		const clientSignal = JSON.parse(clientSignals[clientId])
		peer.signal(clientSignal)

		delete clientSignals[clientId]
	});
})

/**
 * Client
 */
let clients = 0
const createClient = () => {
	const clientId = `client-${clients++}`;
	console.log(clientId, "createClient")
	const peer = new Peer({initiator: true, trickle: false});
	peer.on('error', console.error)
	peer.on('signal', data => {
		clientSignals[clientId] = JSON.stringify(data)
		db.send("clientSignalsChanged")
	})
	peer.on('connect', () => {
		console.log(clientId, 'CLIENT CONNECT')
		window.addEventListener("mousemove", (event) => {
			peer.send(`💻: ${new Date().toLocaleTimeString()} - ${event.x} ${event.y}`)
		}, {passive: true});

		setInterval(() => {
		}, 2000)
	})
	peer.on('data', data => { console.log(clientId, `got a message:`, data) })

	db.on("hubSignalsChanged", () => {
		const signal = hubSignals[clientId]
		if(!signal){return;}
		console.log(clientId, "received hubSignal")
		peer.signal(JSON.parse(signal));
		delete hubSignals[clientId];
	})
}

document.querySelector("button").addEventListener("click",createClient)

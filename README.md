# SmartLight Hub

This aims to be a WebRTC based proxy hub. The goal of this hub is to provide an secure interface clients on HTTPs can connect to which will proxy requests to the actual lamps. Therefore the receiver (this page) must be server over HTTP! Otherwise your Browser will block network internal calls over HTTP to your lamps.

Currently this project is in prototyping phase and does not send any colors whatsoever. Instead it currently sends mouse events.

## Usage

1. open http://hub.smartlight.ga and start hub mode
1. open http://hub.smartlight.ga on x other devices and click "create client". From now on, all mouse move events of this device will be send and display on the device in hub mode.

## Setup

1. Install dependencies: `npm i`
1. Start dev server: `npm run dev`
1. build project: `npm run build`
1. deploy the `/dist` content

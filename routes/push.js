var express = require('express');
var router = express.Router();

const objectStore = require('../models/objectStore');

const firebase = require("firebase-admin");
const serviceAccount = require('../private/firebaseKey');


const KEY_PUSH_ID = 'pushId';
const KEY_DEVICE_ID = 'deviceId';


firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
//	databaseURL: "https://your-app-name.firebaseio.com"
});


/* Wake Device */
router.post('/:method/:deviceId', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	
	console.log('----Params', req.params);
	
	const method = req.params.method;	// wake|refresh
	const deviceId = req.params.deviceId;
	
	// Fetch pushId from the DB
	const device = objectStore.get(`${KEY_DEVICE_ID}/${deviceId}`);
	if (!device) {
		res.end(JSON.stringify({ success: false }));
		return;
	}
	const pushId = device.pushId;
	
	const payload = {
		data: {
			title: 'A',
			body: method,
			'content-available': '1',
			'force-start': '1',
		}
	};
	
	const options = {
		priority: 'high',
		timeToLive: 60 * 60 * 24, // 1 day
	};
	
	firebase.messaging().sendToDevice(pushId, payload, options);
	
	
	res.end(JSON.stringify({ success: true }));
	
});




module.exports = router;

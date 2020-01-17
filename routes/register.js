var express = require('express');
var router = express.Router();

const objectStore = require('../models/objectStore');


const KEY_PUSH_ID = 'pushId';
const KEY_DEVICE_ID = 'deviceId';


var randomString = function(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';	// 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};


var generateUniqueDeviceCode = function() {
	
	let attempts = 0;
	while (attempts < 5) {
		
		let deviceId = randomString(3 + attempts);
		let exists = (objectStore.get(`${KEY_DEVICE_ID}/${deviceId}`) != null);
		
		if (!exists) {
			return deviceId;
		}
		
	}
	
	return false;	// Failed to make a unique code in several attempts.
	
};


/* Register Push */
router.post('/', function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	
	let params = {
		pushId: null,
		deviceId: null,
		...req.body,
	};
	
	let pushId = params.pushId;
	let deviceId = params.deviceId;
	
	if (!deviceId) {
		// Generate a device ID
		deviceId = generateUniqueDeviceCode();
		if (!deviceId) {
			// Error!
		}
	}
	
	// Save the pushId & deviceId with references to eachother
	objectStore.set(`${KEY_PUSH_ID}/${pushId}`, { deviceId: deviceId } );
	objectStore.set(`${KEY_DEVICE_ID}/${deviceId}`, { pushId: pushId } );
	
	
	// Return the deviceId in case it's new.
	let result = {
		deviceId: deviceId,
		pushId: pushId,
		success: true,
	};
	
	res.end(JSON.stringify(result));
	
});

module.exports = router;

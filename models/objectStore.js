
/**
 * Simple value storage.
 *
 * Currenly just a global variable, in future this could be linked to a real data store.
 *
 * @constructor
 */
let ObjectStore = function () {
	if (typeof(global.simpleDataStore) === 'undefined') {
		global.simpleDataStore = {};
	}
};

ObjectStore.prototype._getStore = function() {
	return global.simpleDataStore;
};

ObjectStore.prototype.get = function(key) {
	let store = this._getStore();
	if (typeof(store[key]) === 'undefined') {
		return null;
	}
	return store[key];
};

ObjectStore.prototype.set = function(key, newData, dontMerge) {
	dontMerge = (dontMerge === true);
	
	let store = this._getStore();
	
	let data = this.get(key);
	if (data === null) {	// New record, set created time
		data = {
			created: (new Date()).toISOString(),
			...newData,
		};
	} else {	// Existing record, merge data.
		if (dontMerge) {
			data = {
				created: data.created,
				...newData,
			};
		} else {
			data = {
				...data,
				...newData,
			};
		}
	}
	data.updated = (new Date()).toISOString();
	
	return store[key] = data;
};

ObjectStore.prototype.remove = function(key) {
	let store = this._getStore();
	if (typeof(store[key]) === 'undefined') {
		return false;
	}
	return delete store[key];
};

module.exports = new ObjectStore();
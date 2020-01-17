
// node tests/objectStoreTest.js

const objectStore = require('../models/objectStore');


let value;
const testObj = { 'prop' : 'testValue' };

// Get unset value
value = objectStore.get('test');
console.assert(value == null, 'unset value is null');

// Set & Get value
objectStore.set('test', testObj);
value = objectStore.get('test');
console.assert(value.prop == testObj.prop, 'Set value is set');

// Remove value
value = objectStore.remove('test');
console.assert(value == true, 'value was removed');
value = objectStore.remove('test');
console.assert(value == false, 'value was already removed');


console.log('tick good');
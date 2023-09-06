"use strict";
fetch("https://jsonplaceholder.typicode.com/posts")
.then(data => {return data.json()})
.then(res => {console.log(res)});
//const localforage = require("../lib/localforage");
// Implement the driver here.
var myCustomDriver = {
	_driver: 'customDriverUniqueName',
	_initStorage: function(options) {
		 // Custom implementation here...
	},
	clear: function(callback) {
		 // Custom implementation here...
	},
	getItem: function(key, callback) {
		 // Custom implementation here...
	},
	iterate: function(iteratorCallback, successCallback) {
		 // Custom implementation here...
	},
	key: function(n, callback) {
		 // Custom implementation here...
	},
	keys: function(callback) {
		 // Custom implementation here...
	},
	length: function(callback) {
		 // Custom implementation here...
	},
	removeItem: function(key, callback) {
		 // Custom implementation here...
	},
	setItem: function(key, value, callback) {
		 // Custom implementation here...
	}
}

// Add the driver to localForage.
localforage.defineDriver(myCustomDriver);
localforage.setDriver(myCustomDriver);
console.log(localforage.driver());

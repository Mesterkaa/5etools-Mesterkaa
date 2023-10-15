"use strict";
const baseUrl = `${window.location.protocol}//${window.location.host}`;
const ClientId = "Ak-Id";

console["HEJ"]("HEJ")

const _VALUE = "Value";
const _KEY = "Key";
const _COUNT = "Count";
const _KEYS = "Keys";

//Config the Storage if needed?
function _initStorage(options) {
	console.debug("Options: ", options)
};

function clear(callback) {
	var promise = new Promise((resolve, reject) => {
		this.ready().then(() => {
			console.debug("Clear called");
			const url = `${baseUrl}/storage/${ClientId}/clear`;
			fetch(url, {
				method: 'DELETE'
			})
			.then((response) => {
				resolve(null);
			})
			.catch(error => {
				reject(error);
			});
		})

	})
	executeCallback(promise, callback);
	return promise;

}

function getItem(key, callback) {
	var promise = new Promise((resolve, reject) => {
		this.ready().then(() => {
			console.debug("GetItem called with input: '%s'", key);
			const url = `${baseUrl}/storage/${ClientId}/getItem/${key}`;
			fetch(url, {
				method: 'GET',
				headers: {
					 'Accept': 'application/json',
					 'Content-Type': 'application/json'
				}
			})
			.then(async (response) => {
				let statusCode = response.status;
				if (statusCode == 200) {
					let json = await response.json();
					let value = json[_VALUE];
					if (value === undefined) {
						value = null;
					}
					resolve(value);
				} else {
					resolve(undefined);
				}

			})
			.catch(error => {
				reject(error);
			});
		})

	})
	executeCallback(promise, callback);
	return promise;

}

function iterate(iteratorCallback, callback){
	var promise = new Promise((resolve, reject) => {
		this.ready().then(() => {
			console.debug("Iterate called");
			const url = `${baseUrl}/storage/${ClientId}/iterate`;
			fetch(url, {
				method: 'GET',
				headers: {
					 'Accept': 'application/json',
					 'Content-Type': 'application/json'
				}
			})
			.then(async (response) => {
				let json = await response.json();
				var count = 1;
				json.forEach(element => {
					let value = element[_VALUE];
					let key = element[_KEY];
					iteratorCallback(value, key, count++);
				});
				resolve(true)
			})
			.catch(error => {
				reject(error);
			});
		})

	})
	executeCallback(promise, callback);
	return promise;

}

function key(n, callback) {
	var promise = new Promise((resolve, reject) => {
		this.ready().then(() => {
			console.debug("Key called with input: '%s'", n);
			const url = `${baseUrl}/storage/${ClientId}/key/${n}`;
			fetch(url, {
				method: 'GET',
				headers: {
					 'Accept': 'application/json',
					 'Content-Type': 'application/json'
				}
			})
			.then(async (response) => {
				let statusCode = response.status;
				if (statusCode == 400) {
					reject(`Bad key: '${n}'`);
				} else if (statusCode == 204) {
					console.debug(`No key found: '${n}'`);
					resolve(null);
				} else {
					let json = await response.json();
					resolve(json[_KEY]);
				}


			})
			.catch(error => {
				reject(error);
			});
		})

	})
	executeCallback(promise, callback);
	return promise;
}

function keys(callback) {
	var promise = new Promise((resolve, reject) => {
		this.ready().then(() => {
			console.debug("Keys called");
			const url = `${baseUrl}/storage/${ClientId}/keys`;
			fetch(url, {
				method: 'GET',
				headers: {
					 'Accept': 'application/json',
					 'Content-Type': 'application/json'
				}
			})
			.then(async (response) => {
				let json = await response.json();
				resolve(json[_KEYS]);
			})
			.catch(error => {
				reject(error);
			});
		})

	})
	executeCallback(promise, callback);
	return promise;
}

function length(callback) {

	var promise = new Promise((resolve, reject) => {
		this.ready().then(() => {

			console.debug("Length called");
			const url = `${baseUrl}/storage/${ClientId}/length`;
			fetch(url, {
				method: 'GET',
				headers: {
					 'Accept': 'application/json',
					 'Content-Type': 'application/json'
				}
			})
			.then(async (response) => {
				let json = await response.json();

				let statusCode = response.status;
				if (statusCode == 200) {
					console.debug(`${ClientId} - Length: ${JSON.stringify(json)}`)
				} else {
					console.debug(`Unexpected statusCode: ${statusCode}`)
				}

				resolve(Number(json[_COUNT]));
			})
			.catch(error => {
				reject(error);
			});
		})

	})
	executeCallback(promise, callback);
	return promise;
}

function removeItem(key, callback) {
	var promise = new Promise((resolve, reject) => {
		this.ready().then(() => {
			console.debug("RemoveItem called with input: '%s", key);
			const url = `${baseUrl}/storage/${ClientId}/removeItem/${key}`;
			fetch(url, {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			}).then(async (response) => {
				let statusCode = response.status;
				if (statusCode == 204) {
					console.debug(`Key: '${key}' not found. Nothing to delete`);
				} else if (statusCode == 200) {
					console.debug(`Removed item with key: ${key}`)
				} else {
					console.debug(`Unexpected statusCode: ${statusCode}`)
				}

				resolve(null);
			}).catch(error => {
				reject(error);
			});
			})

	})
	executeCallback(promise, callback);
	return promise;

}

function setItem(key, value, callback) {
	var promise = new Promise((resolve, reject) => {
		this.ready().then(() => {
			console.debug("SetItem called with input: '%s' and '%s'", key, value);
			const url = `${baseUrl}/storage/${ClientId}/setItem/${key}`;
				fetch(url, {
					method: 'POST',
					body: JSON.stringify({ value: value }),
					headers: {
						 'Accept': 'application/json',
						 'Content-Type': 'application/json'
					}
				}).then(async (response) => {
					let json = await response.json();
					let value = json[_VALUE];
					if (value === undefined) {
						value = null;
					}
					resolve(value);
				}).catch(error => {
					reject(error);
				});
		})

	})
	executeCallback(promise, callback);
	return promise;
}


function executeCallback(promise, callback) {
	if (callback) {
		promise.then(
			 function(result) {
				  callback(null, result);
			 },
			 function(error) {
				  callback(error);
			 }
		);
  }
}

const AkStorage = 'ak_serverForage';
var serverForage = {
	_driver: AkStorage,
	_initStorage: _initStorage,
	clear: clear,
	getItem: getItem,
	iterate: iterate,
	key: key,
	keys: keys,
	length: length,
	removeItem: removeItem,
	setItem: setItem
};

localforage.defineDriver(serverForage);
localforage.setDriver(AkStorage);

// var start = async () => {


// 	await localforage.clear();

// 	await localforage.setItem("Damage", 22);
// 	await localforage.setItem("Name", "Mark");
// 	await localforage.setItem("Items", ["Sword", "Shield"]);
// 	await localforage.setItem("Levels", { Wis: 1, Str: 20 });
// 	await localforage.setItem("Info", [{ i: { i: { i: {}}}}, "Shield"]);


// 	var i = []
// 	await localforage.iterate((value, key, index) => {
// 		i.push([value, key, index])

// 	}).then(value => {
// 		console.log(value)
// 	}).catch(error => {
// 		console.log(error);
// 	})
// 	console.table(i)
// 	/*await localforage.length().then(value => {
// 		console.log("Length of storage: %d", value);
// 	});

// 	await localforage.removeItem("test");

// 	await localforage.length().then((value) => {
// 		console.log("Length of storage: %d", value)
// 	});

// 	await localforage.getItem("test").then((value) => {
// 		// An array of all the key names.
// 		console.log("Get: ", value);
// 	})*/

// 	await localforage.keys().then(function(keys) {
// 		// An array of all the key names.
// 		console.log(keys);
// 	}).catch(function(err) {
// 		// This code runs if there were any errors
// 		console.debug(err);
// 	});
// 	console.log("Done")
// }
// start();

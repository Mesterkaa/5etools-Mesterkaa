"use strict";
console.log("start");
localforage.clear()

localforage.setItem("key", "some value", (err, value) => {
	console.log("setItem: " + value)
})
localforage.getItem("key", value => {console.log("getItem: value")})

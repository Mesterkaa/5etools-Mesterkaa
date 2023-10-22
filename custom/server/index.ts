import express from 'express';
import * as http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';

import { logger } from "./config/logger.js"
import { MONGODB_URI, PORT } from "./config/secrets.js";
import { IServerStorage, ServerStorage } from './ServerStorage.js';

class Server {


	public app: express.Application;

	constructor() {

		 this.app = express();
		 this.config();
		 this.mongo();
		 this.routes();
	}

	private routes(): void{
		this.app.use("/", express.static("."))
		//this.app.use("/libs", express.static(__dirname + "/../../../"))

		//
		this.app.get("/storage/distinctIds", async (req, res) => {

			const Ids = await ServerStorage.distinct('ClientId')

			res.status(Ids.length == 0 ? 204 : 200).send(Ids);
		});

		//Removes every key from the database
		this.app.delete("/storage/:id/clear", async (req, res) => {
			const id = req.params.id;

			const storages = await ServerStorage.find(
				{ClientId: id}
			);

			await Promise.all(storages.map(async (storage) => {
				await storage.deleteOne();
			}));

			res.status(storages.length == 0 ? 204 : 200).send(storages);
		});

		//Gets an item by key from storage
		this.app.get("/storage/:id/getItem/:key", async (req, res) => {
			const id = req.params.id;
			const key = req.params.key;

			const storage = await ServerStorage.findOne(
				{ClientId: id, Key: key}
			);

			return res.status(storage == undefined ? 204 : 200).send(convertStorage(storage));
		});

		//Returns all key/value pairs to iterate over
		this.app.get("/storage/:id/iterate", async (req, res) => {
			const id = req.params.id;
			const storages = await ServerStorage.find(
				{ClientId: id});
			return res.status(storages.length == 0 ? 204 : 200).send(storages.map(x => convertStorage(x)));
		});

		//Get key name by keyIndex
		this.app.get("/storage/:id/key/:index", async (req, res) => {
			const id = req.params.id;
			const index = Number(req.params.index);
			if (isNaN(index)) return res.sendStatus(400);

			const storages = await ServerStorage.find(
				{ClientId: id});
				const storage = storages.at(index);
			if (storage == undefined) return res.sendStatus(204);
			return res.send(storage)
		});

		//Get all keys
		this.app.get("/storage/:id/keys", async (req, res) => {
			const id = req.params.id;

			const storages = await ServerStorage.find(
				{ClientId: id},
				{ Key: true });
			return res.send({ Keys: storages.map(x => x.Key)})
		});

		//Get Ids number of keys
		this.app.get("/storage/:id/length", async (req, res) => {
			const id = req.params.id;

			const count = await ServerStorage.count({ClientId: id});
			return res.send({ Count: count});
		});

		//Removes an item from storage
		this.app.delete("/storage/:id/removeItem/:key", async (req, res) => {
			const id = req.params.id;
			const key = req.params.key;

			const storage = await ServerStorage.findOneAndDelete(
				{ClientId: id, Key: key}
			)
			return res.status(storage == null ? 204 : 200).send(convertStorage(storage));
		});

		//Saves a value to storage by key
		this.app.post("/storage/:id/setItem/:key", async (req, res) => {
			const id = req.params.id;
			const key = req.params.key;
			const { value } = req.body;
			const storage = await ServerStorage.findOneAndReplace(
				{ClientId: id, Key: key},
				{ClientId: id, Key: key, Value: value != undefined ? JSON.stringify(value): undefined},
				{ upsert: true, returnDocument: "after" }
				);
			return res.status(201).send(convertStorage(storage));
		});
	}
	private config(): void {
		 this.app.use(cors());
		 this.app.use(express.json());
		 this.app.use(express.urlencoded({extended: false}));
	}
	private mongo(): void {
		 const connection = mongoose.connection;
		 connection.on("connected", () => {
			  logger.info("Mongo Connection Established");
		 });
		 connection.on("reconnected", () => {
			  logger.info("Mongo Connection Reestablished");
		 });
		 connection.on("disconnected", () => {
			  logger.warn("Mongo Connection Disconnected");
			  logger.warn("Trying to reconnect to Mongo ...");
			  setTimeout(()=> {
					mongoose.connect((MONGODB_URI as string), {
						 socketTimeoutMS: 3000, connectTimeoutMS: 3000
					});
			  }, 3000)
		 });
		 connection.on("close", () => {
			  logger.info("Mongo Connection Closed");
		 });
		 connection.on("error", (error: Error) => {
			  logger.error("Mongo Connection ERROR: " + error)
		 });

		 const run = async () => {

			  await mongoose.connect((MONGODB_URI as string));
		 };
		 run().catch(error => logger.error(error));
	}
	public start(): void {
		 const httpServer = http.createServer(this.app);

		 httpServer.listen(PORT, 'localhost', () => {
			  logger.log('info', 'HTTP Server running on port localhost:' + PORT.toString());

		 });
	}
}
const server = new Server();
server.start();

function convertStorage(storage: IServerStorage | null) {
	if (storage == null) return {
		Value: undefined,
		Key: undefined
	}
	return {
		Value: storage.Value != undefined ? JSON.parse(storage.Value) : undefined,
		Key: storage.Key
	}
}

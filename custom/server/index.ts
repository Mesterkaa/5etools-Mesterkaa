import express from 'express';
import * as http from 'http';
import cors from 'cors';

import * as mongoose from 'mongoose';

import {logger} from "./config/logger"
import { MONGODB_URI, PORT } from "./config/secrets";

class Server {


	public app: express.Application;

	constructor() {

		 this.app = express();
		 this.config();
		 this.mongo();
		 this.routes();
	}

	private routes(): void{
		//Removes every key from the database
		this.app.delete("/storage/:id/clear", (req, res) => {});
		//Gets an item by key from storage
		this.app.get("/storage/:id/getItem/:key", (req, res) => {});
		//Returns all key/value pairs to iterate over
		this.app.get("/storage/:id/iterate", (req, res) => {});
		//Get key name by keyIndex
		this.app.get("/storage/:id/key/:index", (req, res) => {});
		//Get all keys
		this.app.get("/storage/:id/keys", (req, res) => {});
		//Get Ids number of keys
		this.app.get("/storage/:id/length", (req, res) => {});
		//Removes an item from storage
		this.app.delete("/storage/:id/removeItem/:key", (req, res) => {});
		//Saves a value to storage by key
		this.app.post("/storage/:id/setItem/:key", (req, res) => {});
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
						 keepAlive: true,
						 socketTimeoutMS: 3000, connectTimeoutMS: 3000,
						 useNewUrlParser: true, useUnifiedTopology: true
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

			  await mongoose.connect((MONGODB_URI as string), {
					keepAlive: true, useNewUrlParser: true, useUnifiedTopology: true
			  });
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

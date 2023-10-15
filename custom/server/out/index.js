"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const http = tslib_1.__importStar(require("http"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const mongoose = require('mongoose');
const logger_1 = require("./config/logger");
const secrets_1 = require("./config/secrets");
const ServerStorage_1 = require("./ServerStorage");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.mongo();
        this.routes();
    }
    routes() {
        this.app.use(express_1.default.static(__dirname + "/../../../"));
        //this.app.use("/libs", express.static(__dirname + "/../../../"))
        //Removes every key from the database
        this.app.delete("/storage/:id/clear", async (req, res) => {
            const id = req.params.id;
            const storages = await ServerStorage_1.ServerStorage.find({ ClientId: id });
            await Promise.all(storages.map(async (storage) => {
                await storage.deleteOne();
            }));
            res.status(storages.length == 0 ? 204 : 200).send(storages);
        });
        //Gets an item by key from storage
        this.app.get("/storage/:id/getItem/:key", async (req, res) => {
            const id = req.params.id;
            const key = req.params.key;
            const storage = await ServerStorage_1.ServerStorage.findOne({ ClientId: id, Key: key });
            return res.status(storage == undefined ? 204 : 200).send(convertStorage(storage));
        });
        //Returns all key/value pairs to iterate over
        this.app.get("/storage/:id/iterate", async (req, res) => {
            const id = req.params.id;
            const storages = await ServerStorage_1.ServerStorage.find({ ClientId: id });
            return res.status(storages.length == 0 ? 204 : 200).send(storages.map(x => convertStorage(x)));
        });
        //Get key name by keyIndex
        this.app.get("/storage/:id/key/:index", async (req, res) => {
            const id = req.params.id;
            const index = Number(req.params.index);
            if (isNaN(index))
                return res.sendStatus(400);
            const storages = await ServerStorage_1.ServerStorage.find({ ClientId: id });
            const storage = storages.at(index);
            if (storage == undefined)
                return res.sendStatus(204);
            return res.send(storage);
        });
        //Get all keys
        this.app.get("/storage/:id/keys", async (req, res) => {
            const id = req.params.id;
            const storages = await ServerStorage_1.ServerStorage.find({ ClientId: id }, { Key: true });
            return res.send({ Keys: storages.map(x => x.Key) });
        });
        //Get Ids number of keys
        this.app.get("/storage/:id/length", async (req, res) => {
            const id = req.params.id;
            const count = await ServerStorage_1.ServerStorage.count({ ClientId: id });
            return res.send({ Count: count });
        });
        //Removes an item from storage
        this.app.delete("/storage/:id/removeItem/:key", async (req, res) => {
            const id = req.params.id;
            const key = req.params.key;
            const storage = await ServerStorage_1.ServerStorage.findOneAndDelete({ ClientId: id, Key: key });
            return res.status(storage == null ? 204 : 200).send(convertStorage(storage));
        });
        //Saves a value to storage by key
        this.app.post("/storage/:id/setItem/:key", async (req, res) => {
            const id = req.params.id;
            const key = req.params.key;
            const { value } = req.body;
            const storage = await ServerStorage_1.ServerStorage.findOneAndReplace({ ClientId: id, Key: key }, { ClientId: id, Key: key, Value: value != undefined ? JSON.stringify(value) : undefined }, { upsert: true, returnDocument: "after" });
            return res.status(201).send(convertStorage(storage));
        });
    }
    config() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    mongo() {
        const connection = mongoose.connection;
        connection.on("connected", () => {
            logger_1.logger.info("Mongo Connection Established");
        });
        connection.on("reconnected", () => {
            logger_1.logger.info("Mongo Connection Reestablished");
        });
        connection.on("disconnected", () => {
            logger_1.logger.warn("Mongo Connection Disconnected");
            logger_1.logger.warn("Trying to reconnect to Mongo ...");
            setTimeout(() => {
                mongoose.connect(secrets_1.MONGODB_URI, {
                    socketTimeoutMS: 3000, connectTimeoutMS: 3000
                });
            }, 3000);
        });
        connection.on("close", () => {
            logger_1.logger.info("Mongo Connection Closed");
        });
        connection.on("error", (error) => {
            logger_1.logger.error("Mongo Connection ERROR: " + error);
        });
        const run = async () => {
            await mongoose.connect(secrets_1.MONGODB_URI);
        };
        run().catch(error => logger_1.logger.error(error));
    }
    start() {
        const httpServer = http.createServer(this.app);
        httpServer.listen(secrets_1.PORT, 'localhost', () => {
            logger_1.logger.log('info', 'HTTP Server running on port localhost:' + secrets_1.PORT.toString());
        });
    }
}
const server = new Server();
server.start();
function convertStorage(storage) {
    if (storage == null)
        return {
            Value: undefined,
            Key: undefined
        };
    return {
        Value: storage.Value != undefined ? JSON.parse(storage.Value) : undefined,
        Key: storage.Key
    };
}
//# sourceMappingURL=index.js.map
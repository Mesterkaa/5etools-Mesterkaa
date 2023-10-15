import { Document, Schema, Model, model, Error } from "mongoose";

export interface IServerStorage extends Document {
	ClientId: string;
	Key: string;
	Value: string;
}

export const serverStorageSchema: Schema = new Schema({
	ClientId: {type: String, required: true},
	Key: {type: String, required: true},
	Value: {type: String}
})

export const ServerStorage: Model<IServerStorage> = model<IServerStorage>("ServerStorage", serverStorageSchema)

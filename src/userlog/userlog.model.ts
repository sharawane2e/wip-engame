import * as mongoose from 'mongoose';

export const UserlogSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  email: { type: String, required: true },
  logs: { type: Array, required: true }
});

export interface Userlog extends mongoose.Document {
  id: Number,
  email: String,
  logs: Array<any>
}
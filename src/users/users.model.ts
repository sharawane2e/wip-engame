import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  accessToken: { type: String, required : true},
  purchasedwidgets: { type: Array, required: true },
  cartwidgets: { type: Array, required: true }
});

export interface User extends mongoose.Document {
  id: Number,
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  accessToken: String
  purchasedwidgets: Array<any>,
  cartwidgets: Array<any>
}
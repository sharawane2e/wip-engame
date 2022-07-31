import * as mongoose from 'mongoose';

export const CartSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  subs_type: { type: String, required: true },
  hits_count: { type: Number, required: true },
  days_count: { type: Number, required: true },
  price: { type: Number, required: true }
});

export interface Cart extends mongoose.Document {
  id: Number,
  subs_type: String,
  hits_count: Number,
  days_count: Number,
  price: Number
}
import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  widget_type_id: { type: Number, required: true },
  widget_type: { type: String, required: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  widget_embed_code: { type: String, required: true },
  is_purchased: { type: Boolean, required: true },
  toolname: { type: String, required: true },
  toolLink: { type: String, required: true },
  summary: { type: String, required: true },
  imgUrl: { type: String, required: true },
  hitcount: { type: Number, required: true },
  howtowork: { type: Object, required: true }
});

export interface Product extends mongoose.Document {
  id: Number,
  widget_type_id: Number,
  widget_type: String,
  name: String,
  title: String,
  widget_embed_code: String,
  is_purchased: Boolean,
  toolname: String,
  toolLink: String,
  summary: String,
  imgUrl: String,
  hitcount: Number
  howtowork: Object
}
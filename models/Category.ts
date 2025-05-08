import mongoose, {Schema, Document, model, models } from "mongoose";

interface ICategory extends Document {
    name: string;
    parent?: mongoose.Types.ObjectId;
    properties: object[];
  }

const CategorySchema: Schema = new Schema({
    name: {type: String, required: true},
    parent: {type:mongoose.Types.ObjectId, ref:'Category'},
    properties: [{type:Object}]
});

export const Category = models?.Category || model<ICategory>('Customer', CategorySchema);
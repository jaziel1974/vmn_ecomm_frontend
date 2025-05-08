import mongoose, {Schema, Document, models } from "mongoose";

interface IProduct extends Document {
    title: string;
    description?: string;
    price: number;
    images: string[];
    category: mongoose.Types.ObjectId;
    properties: object;
    stock: mongoose.Types.ObjectId;
    stockAvailable: boolean;
  }

const ProductSchema: Schema = new Schema({
        title: {type:String, required:true},
        description: String,
        price: {type: Number, required: true},
        images: [{type:String}],
        category: {type:mongoose.Types.ObjectId, ref:'Category'},
        properties: {type:Object},
        stock: {type:mongoose.Types.ObjectId, ref:'Stock'},
        stockAvailable: {type:Boolean},
    }, {
        timestamps: true,
});

export const Product = models.Product || model<IProduct>("Product", ProductSchema);
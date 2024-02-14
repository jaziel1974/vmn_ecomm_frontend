import mongoose, {model, Schema, models} from "mongoose";

const StockSchema = new Schema({
        from: {type:String, required:true},
        to: String, required: true,
        quantity: {type: Number, required: true},
    }, {
        timestamps: true,
});

export const Product = models.Stock || model('Stock', ProductSchema);
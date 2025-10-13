import mongoose, { model, models, Schema } from 'mongoose';

const ReviewSchema = new Schema({
    orderId: { type: mongoose.Types.ObjectId, ref: 'Order', required: true },
    userEmail: { type: String, required: true },
    orderRating: { type: Number },
    orderComment: { type: String },
    itemRatings: { type: Object },
    itemComments: { type: Object },
}, {
    timestamps: true
});

export const Review = models?.Review || model('Review', ReviewSchema);

const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    currentUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    model: { type: String, required: true }, 
    numberPlate: { type: String, required: true, unique: true }, 
    images: { type: [String], default: [] }, 
    yearsOld: { type: Number, required: true, min: 0 },
    mileage: { type: Number, required: true }, 
    papersImage: { type: String, default: "" }, 
    pricePerHour: { type: Number, required: true },
    pickupLocation: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Bike = mongoose.model('Bike', );
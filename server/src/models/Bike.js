const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ["bike", "scooty"],
      required: true
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 1
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    images: [
      {
        url: String,
        publicId: String
      }
    ]
  },
  { timestamps: true }
);

bikeSchema.index({
  name: "text",
  brand: "text",
  location: "text"
});

bikeSchema.index({ category: 1, isAvailable: 1, pricePerDay: 1 });

module.exports = mongoose.model("Bike", bikeSchema);
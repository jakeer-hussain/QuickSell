const mongoose = require("mongoose");
const CATEGORIES = require(
    "../constants/categories"
);

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            enum: CATEGORIES,
            required: true,
            // trim: true
        },

        images: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: ["ACTIVE", "SOLD"],
            default: "ACTIVE"
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Listing",
    listingSchema
);
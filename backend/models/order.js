const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },

                quantity: Number,

                price: Number
            }
        ],

        totalPrice: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["Pending", "Paid", "Shipped", "Delivered"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// Get All Orders
const getOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find().populate(
        "items.product",
        "name price"
    );

    res.status(200).json({
        status: "success",
        results: orders.length,
        data: orders
    });

});

// Get Single Order
const getOrder = asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id)
        .populate("items.product");

    if (!order)
        throw new AppError("Order not found", 404);

    res.status(200).json({
        status: "success",
        data: order
    });

});

// Create Order (Checkout)
const createOrder = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne();

    if (!cart)
        throw new AppError("Cart not found", 404);

    if (cart.items.length === 0)
        throw new AppError("Cart is empty", 400);

    const order = await Order.create({
        items: cart.items,
        totalPrice: cart.totalPrice
    });

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(201).json({
        status: "success",
        data: order
    });

});

// Update Order Status
const updateOrder = asyncHandler(async (req, res) => {

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!order)
        throw new AppError("Order not found", 404);

    res.status(200).json({
        status: "success",
        data: order
    });

});

// Delete Order
const deleteOrder = asyncHandler(async (req, res) => {

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order)
        throw new AppError("Order not found", 404);

    res.status(204).json({
        status: "success",
        data: null
    });

});

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
};
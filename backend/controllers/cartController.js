const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// ======================================
// Get Cart
// ======================================

const getCart = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne().populate(
        "items.product",
        "name price images"
    );

    if (!cart) {
        return res.status(200).json({
            status: "success",
            data: {
                items: [],
                totalPrice: 0
            }
        });
    }

    res.status(200).json({
        status: "success",
        data: cart
    });

});

// ======================================
// Add Product To Cart
// ======================================

const addToCart = asyncHandler(async (req, res) => {

    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product)
        throw new AppError("Product not found", 404);

    let cart = await Cart.findOne();

    if (!cart) {
        cart = await Cart.create({
            items: [],
            totalPrice: 0
        });
    }

    const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    );

    if (itemIndex > -1) {

        cart.items[itemIndex].quantity += quantity;

    } else {

        cart.items.push({
            product: product._id,
            quantity,
            price: product.price
        });

    }

    cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    await cart.save();

    res.status(200).json({
        status: "success",
        data: cart
    });

});

// ======================================
// Update Quantity
// ======================================

const updateCartItem = asyncHandler(async (req, res) => {

    const { quantity } = req.body;

    const cart = await Cart.findOne();

    if (!cart)
        throw new AppError("Cart not found", 404);

    const item = cart.items.find(
        item => item.product.toString() === req.params.productId
    );

    if (!item)
        throw new AppError("Product not found in cart", 404);

    item.quantity = quantity;

    cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    await cart.save();

    res.status(200).json({
        status: "success",
        data: cart
    });

});

// ======================================
// Remove Product
// ======================================

const removeCartItem = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne();

    if (!cart)
        throw new AppError("Cart not found", 404);

    cart.items = cart.items.filter(
        item => item.product.toString() !== req.params.productId
    );

    cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    await cart.save();

    res.status(200).json({
        status: "success",
        data: cart
    });

});

// ======================================
// Clear Cart
// ======================================

const clearCart = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne();

    if (!cart)
        throw new AppError("Cart not found", 404);

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
        status: "success",
        message: "Cart cleared successfully"
    });

});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
};
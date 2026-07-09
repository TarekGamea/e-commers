const Product = require("../models/Product");
const Category = require("../models/Category");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// =========================
// Get All Products
// =========================
const getProducts = asyncHandler(async (req, res) => {
    const filter = {};

    // Search by product name
    if (req.query.search) {
        filter.name = {
            $regex: req.query.search,
            $options: "i"
        };
    }

    // Filter by category
    if (req.query.category) {
        filter.category = req.query.category;
    }

    // Filter by stock availability
    if (req.query.inStock !== undefined) {
        filter.inStock = req.query.inStock === "true";
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};

        if (req.query.minPrice) {
            filter.price.$gte = Number(req.query.minPrice);
        }

        if (req.query.maxPrice) {
            filter.price.$lte = Number(req.query.maxPrice);
        }
    }

    const products = await Product.find(filter).populate(
        "category",
        "name description"
    );

    res.status(200).json({
        status: "success",
        results: products.length,
        data: products
    });
});

// =========================
// Get Single Product
// =========================
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    res.status(200).json({
        status: "success",
        data: product
    });
});

// =========================
// Create Product
// =========================
const createProduct = asyncHandler(async (req, res) => {

    // Make sure category exists
    const category = await Category.findById(req.body.category);

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    const product = await Product.create(req.body);

    res.status(201).json({
        status: "success",
        data: product
    });
});

// =========================
// Update Product
// =========================
const updateProduct = asyncHandler(async (req, res) => {

    // Validate category if user changes it
    if (req.body.category) {

        const category = await Category.findById(req.body.category);

        if (!category) {
            throw new AppError("Category not found", 404);
        }
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    res.status(200).json({
        status: "success",
        data: product
    });
});

// =========================
// Delete Product
// =========================
const deleteProduct = asyncHandler(async (req, res) => {

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    res.status(204).json({
        status: "success",
        data: null
    });
});

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};
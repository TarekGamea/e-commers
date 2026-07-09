const Category = require("../models/Category");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// Get All Categories
exports.getCategories = asyncHandler(async (req, res) => {

    const categories = await Category.find();

    res.status(200).json({
        status: "success",
        results: categories.length,
        data: categories
    });

});

// Get Single Category
exports.getCategory = asyncHandler(async (req, res) => {

    const category = await Category.findById(req.params.id);

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    res.status(200).json({
        status: "success",
        data: category
    });

});

// Create Category
exports.createCategory = asyncHandler(async (req, res) => {

    const category = await Category.create(req.body);

    res.status(201).json({
        status: "success",
        data: category
    });

});

// Update Category
exports.updateCategory = asyncHandler(async (req, res) => {

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    res.status(200).json({
        status: "success",
        data: category
    });

});

// Delete Category
exports.deleteCategory = asyncHandler(async (req, res) => {

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    res.status(204).json({
        status: "success",
        data: null
    });

});
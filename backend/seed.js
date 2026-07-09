require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./db/connectDB");

const Category = require("./models/Category");
const Product = require("./models/Product");

const seedDatabase = async () => {
    try {

        // Connect to MongoDB
        await connectDB();

        // Clear existing data
        await Product.deleteMany();
        await Category.deleteMany();

        console.log("Old data removed.");

        // Create Categories
        const categories = await Category.insertMany([
            {
                name: "Electronics",
                description: "Electronic devices"
            },
            {
                name: "Clothing",
                description: "Fashion and apparel"
            },
            {
                name: "Books",
                description: "Books and novels"
            }
        ]);

        console.log("Categories created.");

        // Create Products
        await Product.insertMany([
            {
                name: "iPhone 15",
                description: "Apple smartphone",
                price: 45000,
                stock: 20,
                images: ["iphone15.jpg"],
                inStock: true,
                category: categories[0]._id
            },
            {
                name: "Samsung Galaxy S25",
                description: "Samsung flagship phone",
                price: 40000,
                stock: 15,
                images: ["galaxy.jpg"],
                inStock: true,
                category: categories[0]._id
            },
            {
                name: "Gaming Laptop",
                description: "RTX Gaming Laptop",
                price: 70000,
                stock: 10,
                images: ["laptop.jpg"],
                inStock: true,
                category: categories[0]._id
            },
            {
                name: "T-Shirt",
                description: "Cotton T-Shirt",
                price: 350,
                stock: 100,
                images: ["shirt.jpg"],
                inStock: true,
                category: categories[1]._id
            },
            {
                name: "Jeans",
                description: "Blue Denim Jeans",
                price: 900,
                stock: 50,
                images: ["jeans.jpg"],
                inStock: true,
                category: categories[1]._id
            },
            {
                name: "Atomic Habits",
                description: "Self-improvement book",
                price: 450,
                stock: 30,
                images: ["atomic-habits.jpg"],
                inStock: true,
                category: categories[2]._id
            }
        ]);

        console.log("Products created.");

        console.log("Database seeded successfully.");

        process.exit();

    } catch (error) {

        console.error(error);

        process.exit(1);

    }
};

seedDatabase();
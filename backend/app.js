require("dotenv").config();

const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");

const connectDB = require("./db/connectDB");

// Routes
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Middleware
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/* ======================================
   Global Middleware
====================================== */

// Parse JSON request body
app.use(express.json());

// Prevent NoSQL Injection
app.use(
    mongoSanitize({
        replaceWith: "_"
    })
);

/* ======================================
   Home Route
====================================== */

app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to the E-Commerce API"
    });
});

/* ======================================
   API Routes
====================================== */

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

/* ======================================
   404 Middleware
====================================== */

app.use(notFound);

/* ======================================
   Global Error Handler
====================================== */

app.use(errorHandler);

/* ======================================
   Connect Database & Start Server
====================================== */

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to connect to MongoDB");
        console.error(error.message);
        process.exit(1);
    }
};

startServer();
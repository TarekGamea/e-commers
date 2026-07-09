const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true
        },

        description: {
            type: String,
            required: [true, "Category description is required"],
            trim: true
        },

        slug: {
            type: String,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

// Automatically create slug before saving
categorySchema.pre("save", function (next) {
    this.slug = slugify(this.name, {
        lower: true,
        strict: true
    });

    next();
});

module.exports = mongoose.model("Category", categorySchema);
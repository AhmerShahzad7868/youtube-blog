const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,   
        required: true
    },
    coverImageURL: {
        type: String,
        default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" 
    },
    createdby: {
        type: Schema.Types.ObjectId,
        ref: "User", // Capitalized model name ("User")
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

const Blog = model("Blog", blogSchema);
module.exports = Blog;

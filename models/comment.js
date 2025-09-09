const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "Blog", 
    },      
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User", 
    },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

const Comment = model("Comment", commentSchema);
module.exports = Comment;

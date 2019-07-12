const mongoose = require("mongoose");

const Post = new mongoose.Schema({
    title : String,
    content : String,
    tags : [String],
    publishedDate : {
        type : Date,
        default : new Date()
    }
});

module.exports = mongoose.model("Post", Post);

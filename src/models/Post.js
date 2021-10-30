const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: [6, 'Title should be at least 6 characters long ']
    },
    keyword: {
        type: String,
        required: true,
        minlength: [6, 'Keyword should be at least 6 characters long ']
    },
    location: {
        type: String,
        required: true,
        maxlength: [10, 'Location should be max 10 characters long']
    },
    date: {
        type: String,
        required: true,
        minlength: [10, 'Date should be exactly 10 characters'],
        maxlength: [10, 'Date should be exactly 10 characters'],
    },
    imageUrl: {
        type: String,
        required: true,
        validate: [/^https?:\/\//, 'Image url should start with http:// or https://']
    },
    description: {
        type: String,
        required: true,
        min: [8, 'Description should be min 8 characters'],
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    voters: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

const Post = mongoose.model(`Post`, postSchema);

module.exports = Post;
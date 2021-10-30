const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { SALT_ROUNDS } = require('../utils/constants');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        min: [3, 'Name must be min 3 characters long'],
        validate: [/[A-Za-z]+/, 'First Name should contains only english letters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        min: [5, 'Name must be min 5 characters long'],
        validate: [/[A-Za-z]+/, 'Last Name should contains only english letters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [ /^[A-Za-z]+@[a-z]+\.[a-z]{2,3}$/i, 'Invalid mail format']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        min: [4, 'Password must be min 4 characters long ']
    },
    myPosts: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Post'
        }
    ]
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    try {
        const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
        this.password = hash;
        next();
    } catch (err) {
        throw { message: 'Unsuccessful user register' }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
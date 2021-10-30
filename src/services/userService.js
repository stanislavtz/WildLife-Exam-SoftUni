const bcrypt = require('bcrypt');

const User = require('../models/User');

const { JWT_SECRET } = require('../utils/constants');
const { jwtSign } = require('../utils/jwtUtil');

function register(data) {
    const { firstName, lastName, email, password, rePassword } = data; 

    if (password !== rePassword) {
        throw { message: 'Password don\'t match' }
    }

    return User.create({ firstName, lastName, email, password }); 
}

async function login(data) {
    const { email, password } = data; // Depends of body sent by request
    if (!email) {
        throw { message: 'Username is required' }
    }

    if (!password) {
        throw { message: 'Password is required' }
    }

    const user = await User.findOne({ email }); // Depends of project terms
    if (!user) {
        throw { message: 'Invalid username or password' }
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw { message: 'Invalid username or password' }
    }

    const token = jwtSign(
        {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        },
        JWT_SECRET, { expiresIn: '1d' });

    return token;
}

function getById(id) {
    return User.findById(id).lean();
}

function updateById(id, user) {
    return User.findByIdAndUpdate(id, user);
}

module.exports = {
    register,
    login,
    getById,
    updateById
}
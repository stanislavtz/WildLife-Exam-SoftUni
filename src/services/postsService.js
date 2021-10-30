const Post = require('../models/Post');

const create = (data) => Post.create(data);

const getAll = () => Post.find().populate('owner').lean();

const getUserPosts = (userId) => Post.find({owner: userId}).populate('owner').lean();

const getOneById = (id) => Post.findById(id).populate('voters').populate('owner').lean();

const updateOneById = (id, data) => Post.findByIdAndUpdate(id, data, { runValidators: true });

const deleteOneById = (id) => Post.findByIdAndDelete(id);

module.exports = {
    create,
    getAll,
    getOneById,
    updateOneById,
    deleteOneById,
    getUserPosts
}
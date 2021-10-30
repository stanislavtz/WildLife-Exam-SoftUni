const Post = require('../models/Post');

const create = (data) => Post.create(data);

const getAll = () => Post.find().lean();

const usersPosts = (userId) => Post.find({owner: userId}).lean();

const getOneById = (id) => Post.findById(id).populate('voters').lean();

const updateOneById = (id, data) => Post.findByIdAndUpdate(id, data, { runValidators: true });

const deleteOneById = (id) => Post.findByIdAndDelete(id);

module.exports = {
    create,
    getAll,
    getOneById,
    updateOneById,
    deleteOneById,
    usersPosts
}
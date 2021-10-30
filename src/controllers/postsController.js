const router = require('express').Router();

const userService = require('../services/userService');
const postsService = require('../services/postsService');
const { isAuthenticated, isAuthorized, isNotOwner } = require('../middlewares/authMiddleware');

function getCreatePage(req, res) {
    try {
        res.render('post/create');
    } catch (error) {
        res.locals.error = { message: 'The server is not connected' }
        res.render('404');
    }
}

async function createPost(req, res) {
    try {
        const data = new Object(req.body);
        data.owner = req.user._id;

        const user = await userService.getById(req.user._id);
        const post = await postsService.create(data);

        user.myPosts.push(post._id);
        await userService.updateById(user._id, user);

        res.redirect('/post/all-posts');
    } catch (error) {
        console.error(error);
        res.locals.error = error;
        res.render('post/create', { ...req.body })
    }
}

async function getAllPosts(req, res) {
    try {
        const posts = await postsService.getAll();
        res.render('post/all-posts', { posts })
    } catch (error) {
        console.error(error);
        res.redirect('/')
    }
}

async function getUserPosts(req, res) {
    const posts = await postsService.getUserPosts(req.user._id);

    res.render('post/my-posts', { posts })
}

async function getDetailsPage(req, res) {
    try {
        const post = await postsService.getOneById(req.params.postId);
        if (post.owner._id == req.user?._id) {
            res.locals.user.isOwner = true;
        }

        const voted = post.voters.map(p => p.email).join(', ');
        if (voted.includes(req.user?.email)) {
            res.locals.user.hadVoted = true;
        }

        res.render('post/details', { ...post, voted })

    } catch (error) {
        console.error(error);
        res.locals.error = { message: 'The server is not connected' }
        res.render('404');
    }
}

async function getEditPage(req, res) {
    try {
        const post = await postsService.getOneById(req.params.postId);

        res.render('post/edit', { ...post });

    } catch (error) {
        console.error(error);
        res.locals.error = { message: 'The server is not connected' }
        res.render('404');
    }
}

async function editPost(req, res) {
    try {
        const data = new Object(req.body);

        const post = await postsService.updateOneById(req.params.postId, data);

        res.redirect(`/post/${post._id}/details`);

    } catch (error) {
        console.error(error);
        res.locals.error = error;
        res.render('post/edit', { ...req.body });
    }
}

async function deletePost(req, res) {
    try {
        await postsService.deleteOneById(req.params.postId);

        res.redirect('/post/all-posts');

    } catch (error) {
        console.error(error);
        res.locals.error = { message: 'The product is not available' }
        res.render('404');
    }
}

async function upVotePost(req, res) {
    try {
        const user = await userService.getById(req.user._id);
        const post = await postsService.getOneById(req.params.postId);

        post.voters.push(user._id);
        post.rating += 1;

        await userService.updateById(user._id, user);
        await postsService.updateOneById(post._id, post);

        res.redirect(`/post/${post._id}/details`);

    } catch (error) {
        console.error(error);
        res.locals.error = error;
    }
}

async function downVotePost(req, res) {
    try {
        const user = await userService.getById(req.user._id);
        const post = await postsService.getOneById(req.params.postId);

        post.voters.push(user._id);

        if (post.rating > 0) {
            post.rating -= 1;
        }

        await userService.updateById(user._id, user);
        await postsService.updateOneById(post._id, post);

        res.redirect(`/post/${post._id}/details`);

    } catch (error) {
        console.error(error);
        res.locals.error = error;
    }
}

router.get('/all-posts', getAllPosts);

router.get('/create', isAuthenticated, getCreatePage);
router.post('/create', isAuthenticated, createPost);

router.get('/:postId/details', getDetailsPage);

router.get('/:postId/edit', isAuthorized, getEditPage);
router.post('/:postId/edit', isAuthorized, editPost);

router.get('/:postId/delete', isAuthorized, deletePost);

router.get('/:postId/upVote', isNotOwner, upVotePost);
router.get('/:postId/downVote', isNotOwner, downVotePost);

router.get('/:userId/my-posts', getUserPosts);

module.exports = router;
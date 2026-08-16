const express = require('express');
const router = express.Router();
const { createPost, getPosts, getFeedPosts, getPostById, updatePost, deletePost, likePost, unlikePost } = require('../controllers/postController');
const { addComment, getPostComments } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createPost)
  .get(getPosts);

router.get('/feed', protect, getFeedPosts);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/:id/like')
  .post(protect, likePost)
  .delete(protect, unlikePost);

router.route('/:id/comments')
  .post(protect, addComment)
  .get(getPostComments);

module.exports = router;

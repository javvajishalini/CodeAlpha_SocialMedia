const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostById, updatePost, deletePost, likePost, unlikePost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createPost)
  .get(getPosts);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/:id/like')
  .post(protect, likePost)
  .delete(protect, unlikePost);

module.exports = router;

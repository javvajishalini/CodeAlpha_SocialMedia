const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, followUser, unfollowUser, searchUsers, toggleSavePost, getSavedPosts } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/search', searchUsers);
router.get('/saved', protect, getSavedPosts);
router.post('/save/:postId', protect, toggleSavePost);
router.get('/:username', getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);

module.exports = router;

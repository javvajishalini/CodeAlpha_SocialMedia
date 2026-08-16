const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get user profile by username
// @route   GET /api/users/:username
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const posts = await Post.find({ author: user._id }).populate('author', 'name username profilePicture').sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.name = req.body.name || user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      name: updatedUser.name,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserProfile, updateUserProfile };

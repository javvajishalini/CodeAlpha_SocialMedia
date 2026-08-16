import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

const PostCard = ({ post, onLike, onDelete }) => {
  const { user } = useContext(AuthContext);
  const isLiked = post.likes.includes(user?._id);
  const isAuthor = post.author._id === user?._id;

  const handleLike = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (isLiked) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}/like`, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/posts/${post._id}/like`, {}, config);
      }
      onLike(post._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, config);
        onDelete(post._id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Link to={`/profile/${post.author.username}`}>
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold overflow-hidden">
              {post.author.profilePicture ? (
                <img src={post.author.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                post.author.name.charAt(0).toUpperCase()
              )}
            </div>
          </Link>
          <div className="ml-3">
            <Link to={`/profile/${post.author.username}`} className="font-semibold text-gray-900 hover:underline">
              {post.author.name}
            </Link>
            <div className="text-xs text-gray-500">
              @{post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        {isAuthor && (
          <button onClick={handleDelete} className="text-gray-400 hover:text-red-500">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        )}
      </div>

      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
      
      {post.image && (
        <div className="mb-4 rounded-lg overflow-hidden border border-gray-100">
          <img src={post.image} alt="Post attachment" className="w-full h-auto object-cover max-h-96" />
        </div>
      )}

      <div className="flex items-center text-gray-500 space-x-6 border-t border-gray-100 pt-3 mt-4">
        <button 
          onClick={handleLike}
          className={`flex items-center space-x-2 hover:text-red-500 transition-colors ${isLiked ? 'text-red-500' : ''}`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{post.likes.length}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
          <MessageCircle className="h-5 w-5" />
          <span>{post.comments?.length || 0}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PostCard;

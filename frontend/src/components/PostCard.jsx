import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Trash2 } from 'lucide-react';

const PostCard = ({ post, onLike, onDelete }) => {
  const { user } = useContext(AuthContext);
  const isLiked = post.likes.includes(user?._id);
  const isAuthor = post.author._id === user?._id;

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const handleLike = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (isLiked) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}/like`, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/posts/${post._id}/like`, {}, config);
      }
      onLike(post._id); // We'd update the local state in the parent
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

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setIsLoadingComments(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${post._id}/comments`);
        setComments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${post._id}/comments`,
        { content: newComment },
        config
      );
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async (commentId) => {
    if (window.confirm('Delete comment?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL}/comments/${commentId}`, config);
        setComments(comments.filter(c => c._id !== commentId));
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
          <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors">
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
        <button 
          onClick={toggleComments}
          className={`flex items-center space-x-2 hover:text-blue-500 transition-colors ${showComments ? 'text-blue-500' : ''}`}
        >
          <MessageCircle className="h-5 w-5" />
          <span>{post.comments?.length || 0}</span>
        </button>
        <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <form onSubmit={submitComment} className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <button 
              type="submit"
              disabled={!newComment.trim()}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {isLoadingComments ? (
            <div className="text-center py-2 text-sm text-gray-500">Loading comments...</div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment._id} className="flex space-x-3 group">
                  <Link to={`/profile/${comment.author.username}`} className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold overflow-hidden text-xs">
                      {comment.author.profilePicture ? (
                        <img src={comment.author.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        comment.author.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  </Link>
                  <div className="flex-grow bg-gray-50 rounded-2xl px-4 py-2 relative">
                    <Link to={`/profile/${comment.author.username}`} className="font-semibold text-gray-900 text-sm hover:underline">
                      {comment.author.name}
                    </Link>
                    <p className="text-gray-800 text-sm">{comment.content}</p>
                    
                    {comment.author._id === user?._id && (
                      <button 
                        onClick={() => deleteComment(comment._id)}
                        className="absolute right-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center py-2 text-sm text-gray-500">No comments yet.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;

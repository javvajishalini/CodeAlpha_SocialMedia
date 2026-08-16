import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { Link } from 'react-router-dom';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/posts/feed`, config);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching feed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user.token]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p._id !== postId));
  };

  const handlePostLiked = (postId) => {
    setPosts(posts.map(post => {
      if (post._id === postId) {
        const isLiked = post.likes.includes(user._id);
        const newLikes = isLiked 
          ? post.likes.filter(id => id !== user._id) 
          : [...post.likes, user._id];
        return { ...post, likes: newLikes };
      }
      return post;
    }));
  };

  if (loading) return (
    <div className="flex justify-center mt-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: Profile Summary */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="h-16 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="px-4 pb-6 relative text-center">
              <Link to={`/profile/${user.username}`}>
                <div className="w-16 h-16 mx-auto bg-white rounded-full p-1 shadow-md -mt-8 mb-2">
                  <div className="w-full h-full bg-blue-100 text-blue-600 rounded-full flex items-center justify-center overflow-hidden font-bold">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                </div>
              </Link>
              <Link to={`/profile/${user.username}`} className="font-bold text-gray-900 hover:underline block">
                {user.name}
              </Link>
              <p className="text-gray-500 text-sm">@{user.username}</p>
              {user.bio && (
                <p className="mt-3 text-sm text-gray-700">{user.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Feed */}
        <div className="lg:col-span-2 space-y-6">
          <CreatePost onPostCreated={handlePostCreated} />
          
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                Your feed is empty. Follow some users or create a post!
              </div>
            ) : (
              posts.map(post => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  onDelete={handlePostDeleted}
                  onLike={handlePostLiked}
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Suggested */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Trending</h3>
            <div className="space-y-4 text-sm">
              <div className="cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                <p className="text-blue-600 font-semibold">#Connectify</p>
                <p className="text-gray-500 text-xs">1,234 posts</p>
              </div>
              <div className="cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                <p className="text-blue-600 font-semibold">#WebDev</p>
                <p className="text-gray-500 text-xs">856 posts</p>
              </div>
              <div className="cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                <p className="text-blue-600 font-semibold">#CodeAlpha</p>
                <p className="text-gray-500 text-xs">432 posts</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Feed;

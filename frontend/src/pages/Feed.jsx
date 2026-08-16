import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p._id !== postId));
  };

  const handlePostLiked = (postId) => {
    // Optimistic update for likes is already handled in PostCard via state or re-fetch,
    // but a proper global state would update the post object here.
    // We'll let the user refresh or rely on the local component state for now.
  };

  if (loading) return (
    <div className="flex justify-center mt-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-0">
      <CreatePost onPostCreated={handlePostCreated} />
      
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-gray-100">
            No posts yet. Be the first to post!
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
  );
};

export default Feed;

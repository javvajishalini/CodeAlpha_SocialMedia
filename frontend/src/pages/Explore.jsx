import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { Search } from 'lucide-react';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/posts/explore`);
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExplorePosts();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return setUsers([]);
    
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users/search?q=${searchQuery}`);
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Search */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Search Users</h2>
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                placeholder="Search by name or username..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>

            <div className="space-y-4">
              {users.map(u => (
                <Link key={u._id} to={`/profile/${u.username}`} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold overflow-hidden">
                    {u.profilePicture ? (
                      <img src={u.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      u.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    <p className="text-sm text-gray-500">@{u.username}</p>
                  </div>
                </Link>
              ))}
              {searchQuery && users.length === 0 && (
                <p className="text-gray-500 text-center text-sm">No users found.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Explore Posts */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Explore Posts</h2>
          {loading ? (
            <div className="flex justify-center mt-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            posts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                onDelete={() => setPosts(posts.filter(p => p._id !== post._id))}
                onLike={() => {}}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Explore;

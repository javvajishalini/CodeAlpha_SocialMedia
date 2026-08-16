import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Settings, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users/${username}`);
        setProfileUser(data.user);
        setPosts(data.posts);
      } catch (err) {
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p._id !== postId));
  };

  if (loading) return (
    <div className="flex justify-center mt-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  if (error || !profileUser) return (
    <div className="text-center mt-20 text-xl text-gray-600">{error}</div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-16 mb-4">
            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-md">
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center overflow-hidden text-5xl font-bold text-gray-400">
                {profileUser.profilePicture ? (
                  <img src={profileUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profileUser.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            {isOwnProfile ? (
              <Link 
                to="/settings/profile" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-full font-medium transition-colors flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Edit Profile</span>
              </Link>
            ) : (
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full font-medium transition-colors">
                Follow
              </button>
            )}
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profileUser.name}</h1>
            <p className="text-gray-500 font-medium">@{profileUser.username}</p>
          </div>
          
          {profileUser.bio && (
            <p className="mt-4 text-gray-800">{profileUser.bio}</p>
          )}
          
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
          
          <div className="flex space-x-6 mt-6">
            <div className="flex items-center space-x-1 cursor-pointer hover:underline">
              <span className="font-bold text-gray-900">{profileUser.following?.length || 0}</span>
              <span className="text-gray-500">Following</span>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:underline">
              <span className="font-bold text-gray-900">{profileUser.followers?.length || 0}</span>
              <span className="text-gray-500">Followers</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Posts</h2>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-gray-100">
              No posts yet.
            </div>
          ) : (
            posts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                onDelete={handlePostDeleted}
                onLike={() => {}}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

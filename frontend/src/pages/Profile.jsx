import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Settings, Calendar, Grid, Bookmark, X } from 'lucide-react';

// ---- Followers / Following Modal ----
const UserListModal = ({ title, userId, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const endpoint = title === 'Followers' ? 'followers' : 'following';

  useEffect(() => {
    const fetchList = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}/${endpoint}`);
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [userId, endpoint]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col border border-gray-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User List */}
        <div className="overflow-y-auto flex-1 px-4 py-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No {title.toLowerCase()} yet.</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <Link
                  key={u._id}
                  to={`/profile/${u.username}`}
                  onClick={onClose}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="w-11 h-11 bg-blue-100 dark:bg-indigo-900 text-blue-600 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold overflow-hidden flex-shrink-0">
                    {u.profilePicture ? (
                      <img src={u.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      u.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{u.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{u.username}</p>
                    {u.bio && <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{u.bio}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---- Main Profile Component ----
const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [activeTab, setActiveTab] = useState('posts');
  const [modal, setModal] = useState(null); // 'Followers' | 'Following' | null

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users/${username}`);
        setProfileUser(data.user);
        setPosts(data.posts);
        
        if (data.user.followers.includes(currentUser?._id)) {
          setIsFollowing(true);
        }
        setFollowersCount(data.user.followers.length);

        if (isOwnProfile) {
          const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
          const savedData = await axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, config);
          setSavedPosts(savedData.data);
        }
      } catch (err) {
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username, currentUser, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!currentUser || isOwnProfile) return;
    try {
      const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
      if (isFollowing) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/users/${profileUser._id}/follow`, config);
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/users/${profileUser._id}/follow`, {}, config);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p._id !== postId));
    setSavedPosts(savedPosts.filter(p => p._id !== postId));
  };

  if (loading) return (
    <div className="flex justify-center mt-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  if (error || !profileUser) return (
    <div className="text-center mt-20 text-xl text-gray-600 dark:text-gray-400">{error}</div>
  );

  const displayedPosts = activeTab === 'posts' ? posts : savedPosts;

  return (
    <>
      {/* Modal */}
      {modal && (
        <UserListModal
          title={modal}
          userId={profileUser._id}
          onClose={() => setModal(null)}
        />
      )}

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden mb-8 transition-colors duration-300">
          <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 dark:from-indigo-600 dark:to-indigo-900"></div>
          <div className="px-8 pb-8 relative">
            <div className="flex justify-between items-end -mt-16 mb-4">
              <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-full p-1 shadow-md">
                <div className="w-full h-full bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden text-5xl font-bold text-gray-400">
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
                  className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 px-5 py-2 rounded-full font-medium transition-colors flex items-center space-x-2 border border-gray-200 dark:border-slate-700"
                >
                  <Settings className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              ) : (
                <button 
                  onClick={handleFollowToggle}
                  className={`${isFollowing ? 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-white hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600' : 'bg-blue-600 text-white hover:bg-blue-700'} px-8 py-2 rounded-full font-medium transition-colors`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profileUser.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">@{profileUser.username}</p>
            </div>
            
            {profileUser.bio && (
              <p className="mt-4 text-gray-800 dark:text-gray-300">{profileUser.bio}</p>
            )}
            
            <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            
            {/* Clickable Followers / Following */}
            <div className="flex space-x-6 mt-6">
              <button
                onClick={() => setModal('Following')}
                className="flex items-center space-x-1 hover:underline focus:outline-none"
              >
                <span className="font-bold text-gray-900 dark:text-white">{profileUser.following?.length || 0}</span>
                <span className="text-gray-500 dark:text-gray-400">Following</span>
              </button>
              <button
                onClick={() => setModal('Followers')}
                className="flex items-center space-x-1 hover:underline focus:outline-none"
              >
                <span className="font-bold text-gray-900 dark:text-white">{followersCount}</span>
                <span className="text-gray-500 dark:text-gray-400">Followers</span>
              </button>
            </div>
          </div>
        </div>
        
        {isOwnProfile && (
          <div className="flex border-b border-gray-200 dark:border-slate-800 mb-6">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`flex items-center space-x-2 py-4 px-6 font-medium text-sm transition-colors ${activeTab === 'posts' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <Grid className="h-4 w-4" />
              <span>Posts</span>
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`flex items-center space-x-2 py-4 px-6 font-medium text-sm transition-colors ${activeTab === 'saved' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <Bookmark className="h-4 w-4" />
              <span>Saved</span>
            </button>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          {!isOwnProfile && <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Posts</h2>}
          
          <div className="space-y-4">
            {displayedPosts.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
                {activeTab === 'saved' ? "You haven't saved any posts yet." : "No posts yet."}
              </div>
            ) : (
              displayedPosts.map(post => (
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
    </>
  );
};

export default Profile;

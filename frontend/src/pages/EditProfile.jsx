import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profilePicture: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/users/profile`, formData, config);
      
      // Update local storage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const updatedUser = { ...userInfo, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully!');
      setTimeout(() => {
        // We'll force a reload to get the new context data, or user can navigate
        window.location.href = `/profile/${data.username}`;
      }, 1000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-0">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 transition-colors duration-300">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Picture URL</label>
            <input
              type="text"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
            <textarea
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-colors"
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate(`/profile/${user?.username}`)}
              className="mr-4 px-6 py-2 border border-gray-300 dark:border-slate-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors disabled:bg-blue-400 dark:disabled:bg-blue-800"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

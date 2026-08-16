import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, CheckCircle2 } from 'lucide-react';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`, config);
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user.token]);

  const markAllAsRead = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/notifications/read-all`, {}, config);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'like': return <Heart className="h-5 w-5 text-red-500 fill-current" />;
      case 'comment': return <MessageCircle className="h-5 w-5 text-blue-500 fill-current" />;
      case 'follow': return <UserPlus className="h-5 w-5 text-green-500" />;
      default: return null;
    }
  };

  const getNotificationText = (n) => {
    switch(n.type) {
      case 'like': return 'liked your post.';
      case 'comment': return 'commented on your post.';
      case 'follow': return 'started following you.';
      default: return '';
    }
  };

  if (loading) return (
    <div className="flex justify-center mt-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <button 
            onClick={markAllAsRead}
            className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Mark all as read</span>
          </button>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No notifications yet.
            </div>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification._id} 
                className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${notification.read ? 'bg-white' : 'bg-blue-50/50'}`}
              >
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-grow">
                  <p className="text-gray-800">
                    <Link to={`/profile/${notification.sender.username}`} className="font-semibold hover:underline">
                      {notification.sender.name}
                    </Link>{' '}
                    <span className="text-gray-600">{getNotificationText(notification)}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>

                {notification.post?.image && (
                  <div className="flex-shrink-0">
                    <img src={notification.post.image} alt="Post" className="w-12 h-12 object-cover rounded-md" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

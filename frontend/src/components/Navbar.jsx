import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import SocketContext from '../context/SocketContext';
import axios from 'axios';
import { Home, User, Settings, LogOut, Search, Bell, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = ({ toggleTheme, isDark }) => {
  const { user, logout } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    const fetchUnread = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`, config);
        const unread = data.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchUnread();
  }, [user, location.pathname]);

  // Listen for real-time notifications
  useEffect(() => {
    if (socket) {
      socket.on('newNotification', (notification) => {
        setUnreadCount(prev => prev + 1);
        let message = 'You have a new notification!';
        if (notification.type === 'like') message = 'Someone liked your post!';
        if (notification.type === 'comment') message = 'Someone commented on your post!';
        if (notification.type === 'follow') message = 'You have a new follower!';
        toast.success(message);
      });
    }
    return () => {
      if (socket) socket.off('newNotification');
    };
  }, [socket]);

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">Connectify</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <Home className="h-6 w-6" />
            </Link>
            <Link to="/explore" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <Search className="h-6 w-6" />
            </Link>
            <Link to="/notifications" className="relative text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            <Link to={`/profile/${user.username}`} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <User className="h-6 w-6" />
            </Link>
            <button 
              onClick={logout} 
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Home, User, Settings, LogOut, Search, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
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
  }, [user, location.pathname]); // re-fetch when location changes (e.g. visiting notifications page)

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Connectify</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/" className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Home className="h-6 w-6" />
            </Link>
            <Link to="/explore" className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Search className="h-6 w-6" />
            </Link>
            <Link to="/notifications" className="relative text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link to={`/profile/${user.username}`} className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User className="h-6 w-6" />
            </Link>
            <button 
              onClick={logout} 
              className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
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

import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Home, User, Settings, LogOut, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">Connectify</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Home className="h-6 w-6" />
            </Link>
            <Link to={`/profile/${user.username}`} className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User className="h-6 w-6" />
            </Link>
            <Link to="/settings/profile" className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Settings className="h-6 w-6" />
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

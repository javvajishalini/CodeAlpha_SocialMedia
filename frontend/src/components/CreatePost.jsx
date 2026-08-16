import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Image as ImageIcon, Send } from 'lucide-react';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        { content, image },
        config
      );
      setContent('');
      setImage('');
      setShowImageInput(false);
      onPostCreated(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 flex-shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold overflow-hidden">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-grow">
            <textarea
              className="w-full bg-gray-50 rounded-lg p-3 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 resize-none"
              rows="3"
              placeholder={`What's on your mind, ${user?.name}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {showImageInput && (
              <input
                type="text"
                placeholder="Image URL (e.g. https://example.com/image.jpg)"
                className="w-full mt-2 bg-gray-50 rounded-lg p-2 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 text-sm"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            )}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className="flex items-center text-gray-500 hover:text-blue-500 transition-colors space-x-2"
              >
                <ImageIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Photo/Video URL</span>
              </button>
              <button
                type="submit"
                disabled={isLoading || !content.trim()}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Sun className="mr-2" />
          Akesi
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li>
              <Link to="/settings" className="hover:underline flex items-center">
                <Settings className="mr-1" size={18} />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
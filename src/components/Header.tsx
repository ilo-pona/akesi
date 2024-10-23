import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import logo from '/logo.svg';

// Add openSettings to the component props
interface HeaderProps {
  openSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ openSettings }) => {
  return (
    <header className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <img src={logo} alt="Akesi Logo" className="h-8 w-8 mr-2" />
          Akesi
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center text-2xl">
            <li><Link to="/" className="hover:underline font-linja-pona">tomo</Link></li>
            <li><Link to="/about" className="hover:underline font-linja-pona">seme</Link></li>
            <li>
              <button
                onClick={openSettings}
                className="hover:underline flex items-center"
              >
                <Settings size={24} className="mr-1" />
                sitelen/<span className="font-linja-pona">sitelen</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

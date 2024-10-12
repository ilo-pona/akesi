import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { X } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close settings"
        >
          <X size={24} />
        </button>
      </div>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Render</h2>
          <select
            value={settings.render}
            onChange={(e) => updateSettings({ render: e.target.value as 'latin' | 'sitelen_pona' })}
            className="w-full p-2 border rounded"
          >
            <option value="latin">Latin/ASCII</option>
            <option value="sitelen_pona">sitelen pona</option>
          </select>
        </div>

        {settings.render === 'sitelen_pona' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useUCSUR"
              checked={settings.useUCSUR}
              onChange={(e) => updateSettings({ useUCSUR: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="useUCSUR">Use UCSUR</label>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-2">Font</h2>
          <select
            value={settings.font}
            onChange={(e) => updateSettings({ font: e.target.value as 'nasin_nampa' | 'linja_pona' | 'sitelen_pona_pona' })}
            className="w-full p-2 border rounded"
          >
            <option value="nasin_nampa">nasin nanpa</option>
            <option value="linja_pona">linja pona</option>
            <option value="sitelen_pona_pona">sitelen pona pona</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showHints"
            checked={settings.showHints}
            onChange={(e) => updateSettings({ showHints: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="showHints">Show hints</label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
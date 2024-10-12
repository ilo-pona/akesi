import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { X, ToggleLeft, ToggleRight } from 'lucide-react';

// Change the component props to accept an onClose function
interface SettingsPageProps {
  onClose: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose }) => {
  const { settings, updateSettings } = useSettings();

  return (
    // Add an overlay div and a modal container
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close settings"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-medium">latin</span>
              <button
                onClick={() => updateSettings({ render: settings.render === 'latin' ? 'sitelen_pona' : 'latin' })}
                className="relative inline-flex items-center h-10 rounded-full w-20 bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className={`${settings.render === 'latin' ? 'translate-x-1' : 'translate-x-11'} inline-block w-8 h-8 transform bg-white rounded-full transition-transform`} />
              </button>
              <span className="text-lg font-medium">sitelen pona</span>
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
          </div>

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
    </div>
  );
};

export default SettingsPage;

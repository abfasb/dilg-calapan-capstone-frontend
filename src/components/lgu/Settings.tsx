import React, { useState } from 'react';

export default function Settings() {
  const [formData, setFormData] = useState({
    notifications: true,
    darkMode: true,
    language: 'en',
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-cyan-400">System Settings</h1>

      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-300">Email Notifications</h3>
              <p className="text-gray-500 text-sm">Receive email updates for important activities</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.notifications}
                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-600 peer-focus:ring-2 peer-focus:ring-cyan-400 rounded-full peer-checked:bg-cyan-400 relative after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-300">Dark Mode</h3>
              <p className="text-gray-500 text-sm">Enable dark theme for better night viewing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.darkMode}
                onChange={(e) => setFormData({ ...formData, darkMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-600 peer-focus:ring-2 peer-focus:ring-cyan-400 rounded-full peer-checked:bg-cyan-400 relative after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-300">Language</h3>
              <p className="text-gray-500 text-sm">Select your preferred interface language</p>
            </div>
            <select 
              className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-400"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-6">System Information</h2>
        <div className="grid grid-cols-2 gap-6 text-gray-300">
          <div>
            <p className="text-gray-400">Version</p>
            <p>2.3.1</p>
          </div>
          <div>
            <p className="text-gray-400">Last Updated</p>
            <p>March 15, 2024</p>
          </div>
          <div>
            <p className="text-gray-400">Database Status</p>
            <p className="text-green-400">Connected</p>
          </div>
          <div>
            <p className="text-gray-400">API Status</p>
            <p className="text-green-400">Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function Staff() {
  const staffMembers = [
    { id: 1, name: 'John Doe', role: 'Administrator', email: 'john@lgu.gov', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'Field Officer', email: 'jane@lgu.gov', status: 'Active' },
    { id: 3, name: 'Bob Wilson', role: 'Data Analyst', email: 'bob@lgu.gov', status: 'Inactive' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400">Staff Management</h1>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg">
          Add New Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm">Total Staff</h3>
          <p className="text-3xl font-bold text-cyan-400 mt-2">42</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm">Active Members</h3>
          <p className="text-3xl font-bold text-green-400 mt-2">38</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm">Departments</h3>
          <p className="text-3xl font-bold text-purple-400 mt-2">6</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-gray-300">Name</th>
              <th className="px-6 py-4 text-left text-gray-300">Role</th>
              <th className="px-6 py-4 text-left text-gray-300">Email</th>
              <th className="px-6 py-4 text-left text-gray-300">Status</th>
              <th className="px-6 py-4 text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((member) => (
              <tr key={member.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                <td className="px-6 py-4 text-gray-300">{member.name}</td>
                <td className="px-6 py-4 text-gray-400">{member.role}</td>
                <td className="px-6 py-4 text-gray-400">{member.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    member.status === 'Active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-cyan-400 hover:text-cyan-500 mr-4">
                    Edit
                  </button>
                  <button className="text-red-400 hover:text-red-500">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import React from 'react';

const dummyNotices = [
  {
    id: 1,
    title: 'Public Consultation on Waste Management',
    date: 'April 25, 2025',
    content: 'The LGU invites all residents to join the public consultation on the new waste segregation policy.',
  },
  {
    id: 2,
    title: 'Invitation to Bid: Barangay Hall Renovation',
    date: 'April 22, 2025',
    content: 'Interested contractors may submit their sealed bids on or before May 10, 2025.',
  },
  {
    id: 3,
    title: 'Barangay Assembly Schedule',
    date: 'April 20, 2025',
    content: 'The quarterly Barangay Assembly will be held at the covered court at 2:00 PM.',
  },
];

const PublicNotices: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Public Notices</h2>
      <ul className="space-y-4">
        {dummyNotices.map((notice) => (
          <li key={notice.id} className="border rounded-lg p-4 shadow-sm bg-white">
            <h3 className="text-lg font-bold mb-1">{notice.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{notice.content}</p>
            <p className="text-xs text-gray-500">{notice.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicNotices;

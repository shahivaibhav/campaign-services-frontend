import { React } from 'react';

const UserDashboard = ({ campaigns, userEmail }) => {
    return (
        <div className="min-h-screen bg-gray-800 text-white">
            <h2 className="text-2xl font-bold text-gray-200 mb-6">Your Campaigns</h2>
            <div className="bg-[#212121] shadow rounded-lg p-6">
                {campaigns.some(campaign => campaign.targetUsers.includes(userEmail)) ? (
                    <div className="space-y-4">
                        {campaigns
                            .filter(campaign => campaign.targetUsers.includes(userEmail))
                            .map(campaign => (
                                <div key={campaign.id} className="border border-gray-700 rounded p-4">
                                    <h4 className="font-medium text-gray-300">{campaign.name}</h4>
                                    <p className="text-gray-400">{campaign.description}</p>
                                    <span
                                        className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${
                                            campaign.status === 'Pending'
                                                ? 'bg-red-600 text-red-100'
                                                : 'bg-green-600 text-green-100'
                                        }`}
                                    >
                                        {campaign.status}
                                    </span>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center">No campaigns assigned to you yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;

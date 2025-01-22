import React from 'react';
import PropTypes from 'prop-types';

const SuperAdminDashboard = ({ campaigns }) => {
    return (
        <div className="min-h-screen bg-gray-800 text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-200">Campaign Management</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-600">
                    Create New Campaign
                </button>
            </div>
            <div className="bg-[#212121] shadow rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-gray-200">Existing Campaigns</h3>
                <div className="space-y-4">
                    {campaigns.map(campaign => (
                        <div key={campaign.id} className="border border-gray-700 rounded p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium text-gray-300">{campaign.type}</h4>
                                    <p className="text-gray-400">{campaign.description}</p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        campaign.status === 'pending'
                                            ? 'bg-red-600 text-red-100'
                                            : 'bg-green-600 text-green-100'
                                    }`}
                                >
                                    {campaign.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// PropTypes validation
SuperAdminDashboard.propTypes = {
    campaigns: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            type: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            status: PropTypes.oneOf(['pending', 'completed']).isRequired,
        })
    ).isRequired,
};

export default SuperAdminDashboard;

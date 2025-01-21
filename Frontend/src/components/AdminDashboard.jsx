const AdminDashboard = ({ campaigns }) => {
  return (
      <div className="min-h-screen bg-gray-800 text-white">
          <h2 className="text-2xl font-bold text-gray-200 mb-6">Send Campaigns</h2>
          <div className="bg-[#212121] shadow rounded-lg p-6">
              <div className="space-y-4">
                  {campaigns.map(campaign => (
                      <div key={campaign.id} className="border border-gray-700 rounded p-4">
                          <div className="flex justify-between items-center">
                              <div>
                                  <h4 className="font-medium text-gray-300">{campaign.name}</h4>
                                  <p className="text-gray-400">{campaign.description}</p>
                              </div>
                              <div className="space-x-4">
                                  <span
                                      className={`px-3 py-1 rounded-full text-sm ${
                                          campaign.status === 'Pending'
                                              ? 'bg-red-600 text-red-100'
                                              : 'bg-green-600 text-green-100'
                                      }`}
                                  >
                                      {campaign.status}
                                  </span>
                                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                      Send Campaign
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );
};

export default AdminDashboard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";

const SuperAdminDashboard = ({ campaigns, onDelete }) => {
    const navigate = useNavigate();
  
    const createCampaignHandler = () => {
      navigate("/dashboard/create-campaigns");
    };
  
    const updateCampaignHandler = (campaignId) => {
      navigate(`/dashboard/update-campaign/${campaignId}`);
    };
  
    const deleteCampaignHandler = async (campaignId) => {
      const token = Cookies.get("access_token");
      if (!token) {
        toast.error("Access token not found");
        return;
      }
  
      try {
        const deleteResponse = await fetch(
          `http://127.0.0.1:8000/user-campaigns/api/campaign-superadmin/${campaignId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (deleteResponse.ok) {
          toast.success("Campaign deleted successfully!");
          onDelete(campaignId); // Update the campaigns in PBN_Dashboard
        } else {
          toast.error("Failed to delete campaign.");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the campaign.");
        console.error(error);
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-800 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-200">Campaign Management</h2>
          <button
            onClick={createCampaignHandler}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
          >
            Create New Campaign
          </button>
        </div>
        <div className="bg-[#212121] shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 text-gray-200">Existing Campaigns</h3>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border border-gray-700 rounded p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-300">{campaign.type}</h4>
                    <p className="text-gray-400">{campaign.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      campaign.status === "pending"
                        ? "bg-red-600 text-red-100"
                        : "bg-green-600 text-green-100"
                    }`}
                  >
                    {campaign.status}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateCampaignHandler(campaign.id)}
                      className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteCampaignHandler(campaign.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:ring-2 focus:ring-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ToastContainer />
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
            status: PropTypes.oneOf(['pending', 'active']).isRequired,
        })
    ).isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default SuperAdminDashboard;

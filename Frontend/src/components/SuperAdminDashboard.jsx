import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { CircularProgress } from "@mui/material";

const SuperAdminDashboard = ({ campaigns, onDelete }) => {
  const navigate = useNavigate();
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [practiceUsers, setPracticeUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchPracticeUsers = async () => {
      const token = Cookies.get("access_token");
      if (!token) {
        toast.error("Access token not found");
        navigate("/auth");
      }
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/user-campaigns/api/get-practice_users/",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.practice_users_ids)) {
            setPracticeUsers(data.practice_users_ids);
          }
        } else {
          toast.error("Failed to fetch practice users");
        }
      } catch (error) {
        toast.error("An error occurred while fetching practice users");
        console.error(error);
      }
    };
    fetchPracticeUsers();
  }, [navigate]);

  const handleCheckboxChange = (campaignId) => {
    setSelectedCampaigns((prev) =>
      prev.includes(campaignId)
        ? prev.filter((id) => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const submitHandler = async (sendEmail) => {
    if (selectedCampaigns.length === 0 || selectedUsers.length === 0) {
      toast.error("Please select at least one campaign and one user.");
      return;
    }

    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Access token not found");
      navigate("/auth");
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/user-campaigns/api/send-email/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            campaign_ids: selectedCampaigns,
            practice_users_ids: selectedUsers,
            on_email: sendEmail,
          }),
        }
      );

      if (response.ok) {
        let displayName;
        if (sendEmail) {
          displayName = "Via Email";
        } else {
          displayName = "Via Message";
        }
        toast.success(`Campaigns sent successfully ${displayName} !`);
        setTimeout(() => {
          navigate("/all-messages");
        }, 1500);
      } else {
        toast.error("Couldn't send campaigns");
      }
    } catch (error) {
      toast.error("An error occurred while sending campaigns");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAll = async (onEmail) => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user.");
      return;
    }

    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Access token not found");
      navigate("/auth");
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/user-campaigns/api/send-all-campaigns/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            practice_user_ids: selectedUsers,
            on_email: onEmail,
          }),
        }
      );

      if (response.ok) {
        let displayName;
        if (onEmail) {
          displayName = "Via Email";
        } else {
          displayName = "Via Message";
        }
        toast.success(` All Campaigns sent successfully ${displayName} !`);
        setTimeout(() => {
          navigate("/all-messages");
        }, 1500);
      } else {
        toast.error("Couldn't send all campaigns.");
      }
    } catch (error) {
      toast.error("An error occurred while sending campaigns.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-200">
          Campaign Management
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/schedule-campaign")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:ring-2 focus:ring-green-600"
          >
            Schedule Campaign
          </button>
          <button
            onClick={() => navigate("/all-messages")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
          >
            Sent Messages
          </button>
          <button
            onClick={createCampaignHandler}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-600"
          >
            Create New Campaign
          </button>
        </div>
      </div>

      <div className="bg-[#212121] shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium mb-4 text-gray-200">
          Existing Campaigns
        </h3>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border border-gray-700 rounded p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-300">{campaign.type}</h4>
                  <p className="text-gray-400">{campaign.description}</p>
                </div>
                <div className="flex space-x-4 items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      campaign.status === "pending"
                        ? "bg-red-600 text-red-100"
                        : "bg-green-600 text-green-100"
                    }`}
                  >
                    {campaign.status}
                  </span>

                  {/* Show Checkbox Only for Pending Campaigns */}
                  {campaign.status === "pending" && (
                    <button
                      onClick={() => handleCheckboxChange(campaign.id)}
                      className={`border px-3 py-1 rounded focus:ring-2 ${
                        selectedCampaigns.includes(campaign.id)
                          ? "border-green-500"
                          : "border-gray-500"
                      }`}
                      disabled={loading} // Disable while processing
                    >
                      Select
                    </button>
                  )}

                  <button
                    onClick={() => updateCampaignHandler(campaign.id)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-600"
                    disabled={loading}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteCampaignHandler(campaign.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:ring-2 focus:ring-red-600"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {practiceUsers.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg text-gray-200 mb-4">Select Practice Users</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {practiceUsers.map((user) => (
              <div key={user} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user)}
                  onChange={() => handleUserSelection(user)}
                  className="accent-green-600"
                />
                <label className="text-gray-300">{user}</label>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <CircularProgress color="info" />
          <span style={{ marginLeft: "12px", color: "#42a5f5" }}>
            Processing your request...
          </span>
        </div>
      )}

      {selectedCampaigns.length > 0 && selectedUsers.length > 0 && (
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => submitHandler(true)}
            className={`px-4 py-2 rounded focus:ring-2 focus:ring-green-600
    ${
      loading
        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
        : "bg-green-600 text-white hover:bg-green-700"
    }`}
            disabled={loading}
          >
            Send via Email
          </button>

          <button
            onClick={() => submitHandler(false)}
            className={`px-4 py-2 rounded focus:ring-2 focus:ring-orange-500
    ${
      loading
        ? "border border-gray-500 text-gray-400 cursor-not-allowed"
        : "border border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white"
    }`}
            disabled={loading}
          >
            Send via Message
          </button>
        </div>
      )}

      {selectedUsers.length > 0 && (
        <div className="flex gap-4">
          <button
            onClick={() => handleSendAll(true)}
            className={`px-4 py-2 rounded focus:ring-2 focus:ring-green-600
        ${
          loading
            ? "bg-gray-500 text-gray-300 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
            disabled={loading}
          >
            Send All via Email
          </button>

          <button
            onClick={() => handleSendAll(false)}
            className={`px-4 py-2 rounded focus:ring-2 focus:ring-orange-500
        ${
          loading
            ? "border border-gray-500 text-gray-400 cursor-not-allowed"
            : "border border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white"
        }`}
            disabled={loading}
          >
            Send All via Message
          </button>
        </div>
      )}

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
      status: PropTypes.oneOf(["pending", "active"]).isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SuperAdminDashboard;

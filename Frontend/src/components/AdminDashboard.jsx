import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Card, CardContent, Button, Checkbox, Badge, Divider , CircularProgress} from "@mui/material";

const AdminDashboard = ({ campaigns }) => {
  const navigate = useNavigate();
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [practiceUsers, setPracticeUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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
        console.error(error)
      }
    };
    fetchPracticeUsers();
  }, [navigate]);

  const handleCheckboxChange = (campaignId) => {
    setSelectedCampaigns((prev) =>
      prev.includes(campaignId) ? prev.filter((id) => id !== campaignId) : [...prev, campaignId]
    );
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
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

    setLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:8000/user-campaigns/api/send-email/", {
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
      });

      if (response.ok) {
        let displayName;
        if(sendEmail) {
         displayName = "Via Email"
        }else {
          displayName = "Via Message"
        }
        toast.success(`Campaigns sent successfully ${displayName} !`);
        setTimeout(() => {
          navigate("/all-messages");
        }, 1500)
      } else {
        toast.error("Couldn't send campaigns");
      }
    } catch (error) {
      toast.error("An error occurred while sending campaigns");
      console.error(error)
    } finally {
      setLoading(false)
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
      const response = await fetch("http://127.0.0.1:8000/user-campaigns/api/send-all-campaigns/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          practice_user_ids: selectedUsers,
          on_email: onEmail,
        }),
      });

      if (response.ok) {
        let displayName;
        if(onEmail) {
         displayName = "Via Email"
        }else {
          displayName = "Via Message"
        }
        toast.success(` All Campaigns sent successfully ${displayName} !`);
        setTimeout(() => {
          navigate("/all-messages");
        }, 1500)
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
    <div style={{ minHeight: "100vh", backgroundColor: "#121212", color: "#f5f5f5", padding: "24px" }}>
      <ToastContainer />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "26px", fontWeight: "bold" }}>Send Campaigns</h2>
        <div>
          <Button
            onClick={() => navigate("/schedule-campaign")}
            variant="outlined"
            color="success"
            style={{ borderColor: "#66bb6a", color: "#66bb6a" }}
          >
            Schedule Campaign
          </Button>
          <Button
            onClick={() => navigate("/all-messages")}
            variant="contained"
            color="info"
            style={{ marginLeft: "16px", backgroundColor: "#42a5f5" }}
          >
            Sent Messages
          </Button>
        </div>
      </div>

      <div style={{ display: "grid", gap: "24px" }}>
        {campaigns.map((campaign) => (
          campaign.status === "pending" && (
            <Card
              key={campaign.id}
              style={{ backgroundColor: "#1f1f1f", borderRadius: "8px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)" }}
            >
              <CardContent style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ fontWeight: "bold", color: "#e0e0e0" }}>{campaign.type}</h4>
                  <p style={{ color: "#9e9e9e" }}>{campaign.description}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <Checkbox
                    onChange={() => handleCheckboxChange(campaign.id)}
                    checked={selectedCampaigns.includes(campaign.id)}
                    color="success"
                  />
                  <Badge color="primary" style={{ color: "#f44336" }}>
                    Pending
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        ))}
      </div>
      <Divider style={{ margin: "24px 0", backgroundColor: "#424242" }} />
      {practiceUsers.length > 0 && (
        <div>
          <h4 style={{ marginBottom: "16px", color: "#e0e0e0" }}>Select Users</h4>
          <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))" }}>
            {practiceUsers.map((user) => (
              <div key={user} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Checkbox
                  onChange={() => handleUserSelection(user)}
                  checked={selectedUsers.includes(user)}
                  color="success"
                />
                <span>{user}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <CircularProgress color="info" />
          <span style={{ marginLeft: "12px", color: "#42a5f5" }}>Processing your request...</span>
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

    </div>
  );  
};

AdminDashboard.propTypes = {
  campaigns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["pending", "active"]).isRequired,
    })
  ).isRequired,
};

export default AdminDashboard;
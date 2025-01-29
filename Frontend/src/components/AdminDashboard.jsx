import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const AdminDashboard = ({ campaigns }) => {
  const navigate = useNavigate();

  const submitHandler = async (campaignId, sendEmail) => {
    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Access token not found");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/user-campaigns/api/send-email/${campaignId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ on_email: sendEmail }),
        }
      );

      if (response.ok) {
        toast.success("Campaign sent successfully!");
        navigate("/all-messages");
      } else {
        toast.error("Couldn't send campaign");
      }
    } catch (error) {
      toast.error("An error occurred while sending the campaign");
      console.error(error);
    }
  };

  const onSubmitHistory = () => {
    navigate("/all-messages");
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-200">Send Campaigns</h2>
        <button
          onClick={onSubmitHistory}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Sent Messages
        </button>
      </div>
      <div className="bg-[#212121] shadow rounded-lg p-6">
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border border-gray-700 rounded p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-300">{campaign.name}</h4>
                  <p className="text-gray-400">{campaign.description}</p>
                </div>
                <div className="flex space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      campaign.status === "pending"
                        ? "bg-red-600 text-red-100"
                        : "bg-green-600 text-green-100"
                    }`}
                  >
                    {campaign.status}
                  </span>
                  {campaign.status === "pending" && (
                    <>
                      <button
                        onClick={() => submitHandler(campaign.id, true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Send via Email
                      </button>
                      <button
                        onClick={() => submitHandler(campaign.id, false)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Send via Message
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

AdminDashboard.propTypes = {
  campaigns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["pending", "active"]).isRequired,
    })
  ).isRequired,
};

export default AdminDashboard;

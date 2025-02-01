import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AllReceivedMessages = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceivedMessages = async () => {
      const token = Cookies.get("access_token");
      if (!token) {
        toast.error("Access token not found");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/user-campaigns/api/all-sent-messages/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setCampaigns(data);
        } else {
          toast.error("Failed to fetch sent campaigns");
        }
      } catch (error) {
        toast.error("An error occurred while fetching sent campaigns");
        console.error(error);
      }
    };

    fetchReceivedMessages();
  }, []);

  const acceptCampaignButton = async (campaign_id) => {
    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Access token not found");
      return;
    }

    try {
      const url = `http://127.0.0.1:8000/user-campaigns/api/accept/${campaign_id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Campaign accepted successfully!");
        setTimeout(() => {
          navigate("/");
        }, 1000); 
      } else {
        toast.error("Failed to accept campaign");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while accepting the campaign");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-2xl font-bold mb-6">All Received Messages</h2>
      {campaigns.length === 0 ? (
        <p className="text-gray-400">No received messages available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.campaign_id}
              className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="text-xl font-semibold mb-2">{campaign.text}</h3>
              <p className="text-gray-400 mb-4">{campaign.description}</p>
  
              {/* Only show the button if the campaign status is 'pending' */}
              {campaign.status === "pending" ? (
                <button
                  onClick={() => acceptCampaignButton(campaign.campaign_id)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Accept Campaign
                </button>
              ) : (
                <p className="text-gray-500">Status: {campaign.status}</p> // Optional: show campaign status
              )}
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
  
};

export default AllReceivedMessages;

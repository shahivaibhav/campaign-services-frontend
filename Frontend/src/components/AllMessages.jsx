import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const AllMessages = () => {
  const [campaigns, setCampaigns] = useState([]);
  const role = useSelector((state) => state.user.role);

  useEffect(() => {
    const fetchSentCampaigns = async () => {
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
          setCampaigns(data);
        } else {
          toast.error("Failed to fetch sent campaigns");
        }
      } catch (error) {
        toast.error("An error occurred while fetching sent campaigns");
        console.error(error);
      }
    };

    fetchSentCampaigns();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-2xl font-bold mb-6">
        {role === "admin" ? "All Sent Campaigns" : "Received Messages"}
      </h2>
      {campaigns.length === 0 ? (
        <p>No {role === "admin" ? "sent campaigns" : "received messages"} available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded shadow-md">
              <h3 className="text-xl font-semibold mb-2">{campaign.text}</h3>
              <p className="text-gray-400">{campaign.description}</p>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AllMessages;

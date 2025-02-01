import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScheduleCampaign = () => {
  const navigate = useNavigate();
  const [scheduledDatetimes, setScheduledDatetimes] = useState({});
  const [campaigns, setCampaigns] = useState([]);

  // Fetch campaigns when the component mounts
  useEffect(() => {
    const fetchCampaigns = async () => {
      const token = Cookies.get("access_token");
      if (!token) {
        console.error("Access token not found");
        return;
      }
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/user-campaigns/api/campaign-admin/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setCampaigns(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCampaigns();
  }, []); // Runs once on mount

  // Handle input change for scheduled datetime
  const handleDatetimeChange = (campaignId, datetime) => {
    setScheduledDatetimes((prevState) => ({
      ...prevState,
      [campaignId]: datetime,
    }));
  };

  // Convert the selected datetime to the required format with timezone offset
  // Convert the selected datetime to the required format with timezone offset
  const getFormattedDatetimeWithOffset = (datetime) => {
    const date = new Date(datetime); // Create a Date object from the selected datetime
    const timeZone = 'Asia/Kolkata'; // Set the correct timezone (Kolkata)
  
    // Format the date in the specified timezone (Asia/Kolkata)
    const options = { 
      timeZone, 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false
    };
    
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(date); // Format the date in parts to extract each component
  
    // Extract formatted parts to create the required string
    const year = parts.find(part => part.type === 'year').value;
    const month = parts.find(part => part.type === 'month').value;
    const day = parts.find(part => part.type === 'day').value;
    const hour = parts.find(part => part.type === 'hour').value;
    const minute = parts.find(part => part.type === 'minute').value;
    const second = parts.find(part => part.type === 'second').value;
  
    // Kolkata's timezone offset is always +05:30
    const offsetHours = '05';
    const offsetMinutes = '30';
    const sign = '+';
  
    // Return the datetime in the desired format with the correct timezone offset
    return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${offsetHours}:${offsetMinutes}`;
  };
  
  

  // Handle scheduling of the campaign
  const scheduleCampaignHandler = async (campaignId) => {
    const token = Cookies.get("access_token");

    if (!token) {
      toast.error("Login again!");
      navigate("/auth");
      return;
    }

    const scheduledDatetime = scheduledDatetimes[campaignId];

    if (!scheduledDatetime) {
      toast.error("Please select a scheduled date and time.");
      return;
    }

    const formattedDatetime = getFormattedDatetimeWithOffset(scheduledDatetime);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/user-campaigns/api/schedule_campaigns/${campaignId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scheduled_datetime: formattedDatetime }),
        }
      );

      if (response.ok) {
        console.log(formattedDatetime)
        toast.success("Campaign scheduled successfully!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000); // Delay navigation by 2 seconds
      } else {
        toast.error("We couldn't schedule the campaign at the moment!");
      }
    } catch (error) {
      toast.error("Please try again later!");
      console.error(error);
    }
  };

  // Filter campaigns to only show those that are pending
  const pendingCampaigns = campaigns.filter(
    (campaign) => campaign.status === "pending"
  );

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-200">Schedule Campaign</h2>
        <button
          onClick={() => navigate("/all-messages")}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Sent Messages
        </button>
      </div>
      <div className="bg-[#212121] shadow rounded-lg p-6">
        <div className="space-y-4">
          {pendingCampaigns.length === 0 ? (
            <p className="text-gray-400">No pending campaigns available.</p>
          ) : (
            pendingCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border border-gray-700 rounded p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-300">
                      {campaign.name}
                    </h4>
                    <p className="text-gray-400">{campaign.description}</p>
                    <input
                      type="datetime-local"
                      className="mt-2 p-2 rounded bg-gray-700 text-white border border-gray-500"
                      value={scheduledDatetimes[campaign.id] || ""}
                      onChange={(e) =>
                        handleDatetimeChange(campaign.id, e.target.value)
                      }
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => scheduleCampaignHandler(campaign.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCampaign;

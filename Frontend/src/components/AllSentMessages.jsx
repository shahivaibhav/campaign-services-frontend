import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AllMessages = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // ✅ Memoize fetchSentMessages to prevent re-creation
  const fetchSentMessages = useCallback(async (page = 1) => {
    const token = Cookies.get("access_token");
    if (!token) {
      toast.error("Redirecting to sign-in page");
      setTimeout(() => {
        navigate("/auth");
      }, 1000);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/user-campaigns/api/all-sent-messages/?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.results);
        setNextPage(data.next);
        setPrevPage(data.previous);
        setCurrentPage(page);
      } else {
        toast.error("Failed to load all sent messages");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  }, [navigate]); // ✅ Add dependencies to useCallback

  // ✅ Auto-refresh data every 5 seconds
  useEffect(() => {
    fetchSentMessages(currentPage);

    const interval = setInterval(() => {
      fetchSentMessages(currentPage);
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [fetchSentMessages, currentPage]); // ✅ Add dependencies here

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">All Sent Campaigns</h2>

      {campaigns.length === 0 ? (
        <p className="text-gray-400 text-center text-lg">No sent campaigns available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-300">{campaign.text}</h3>
              <p className="text-gray-400">{campaign.description}</p>

              {/* Sent via Email or SMS */}
              <span
                className={`px-3 py-1 mt-2 inline-block rounded-full text-sm ${
                  campaign.sent_via === "email"
                    ? "bg-blue-600 text-blue-100"
                    : "bg-green-600 text-green-100"
                }`}
              >
                Sent via {campaign.sent_via}
              </span>

              {/* Seen Status */}
              <div className="mt-3">
                {campaign.seen ? (
                  <span className="px-3 py-1 text-sm bg-green-600 text-green-100 rounded-full">
                    ✅ Seen
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm bg-red-600 text-red-100 rounded-full">
                    ⏳ Not Seen Yet
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-10 mt-6">
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          disabled={!prevPage}
          onClick={() => fetchSentMessages(currentPage - 1)}
        >
          Previous
        </button>
        <span className="text-lg mt-1 font-semibold">Page {currentPage}</span>
        <button
          className="px-6 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          disabled={!nextPage}
          onClick={() => fetchSentMessages(currentPage + 1)}
        >
          Next
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AllMessages;

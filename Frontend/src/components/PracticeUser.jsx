import React, { useEffect, useState, useRef, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AllReceivedMessages = () => {
  const [messages, setMessages] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const observer = useRef(null); // Ref for Intersection Observer

  // ✅ Memoize fetchReceivedMessages to avoid unnecessary re-creation
  const fetchReceivedMessages = useCallback(async (page = 1) => {
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
        setMessages(data.results);
        setNextPage(data.next);
        setPrevPage(data.previous);
        setCurrentPage(page);
      } else {
        toast.error("Failed to fetch received messages");
      }
    } catch (error) {
      toast.error("An error occurred while fetching received messages");
      console.error(error);
    }
  }, [navigate]);

  // ✅ Auto-refresh messages every 5 seconds
  useEffect(() => {
    fetchReceivedMessages(currentPage);

    const interval = setInterval(() => {
      fetchReceivedMessages(currentPage);
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [fetchReceivedMessages, currentPage]);

  // ✅ Function to mark a message as seen when it's in view
  const markMessageAsSeen = useCallback(async (campaignId) => {
    const token = Cookies.get("access_token");
    if (!token) return;

    try {
      await fetch("http://127.0.0.1:8000/user-campaigns/api/seen-messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaign_id: campaignId }),
      });
    } catch (error) {
      console.error("Failed to update seen status:", error);
    }
  }, []);

  // ✅ Setup observer to mark messages as seen
  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute("data-id");
            if (messageId) {
              markMessageAsSeen(messageId);
            }
          } 
        });
      },
      { threshold: 1.0 } // Fully visible
    );

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [markMessageAsSeen]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <h2 className="text-3xl font-bold mb-4 text-center">Chats</h2>

      {/* Chat messages container */}
      <div className="flex flex-col space-y-4 overflow-y-auto p-6 bg-gray-800 rounded-lg h-[80vh]">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center text-lg">No messages available.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.campaign_id}
              data-id={message.campaign_id}
              ref={(el) => el && observer.current.observe(el)}
              className="flex flex-col bg-gray-700 p-4 rounded-2xl max-w-md shadow-lg"
              style={{
                alignSelf: message.status === "pending" ? "flex-start" : "flex-end",
              }}
            >
              {/* Sender Name & Type */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-blue-400">
                  {message.sender}
                </span>
                <span className="text-sm text-gray-300">
                  {message.sent_via === "email" ? "📧 Email" : "📩 Message"}
                </span>
              </div>

              {/* Message Text & Description */}
              <div className="mt-2 text-white text-lg">
                <p className="font-semibold">{message.text}</p>
                <p className="text-gray-300 text-base">{message.description}</p>
              </div>

              {/* Sent Time */}
              <span className="text-sm text-gray-400 self-end mt-2">
                {message.sent_date} | {message.sent_time}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-10 mt-6">
        <button
          className="px-5 py-2 bg-gray-700 text-white rounded text-lg disabled:opacity-50"
          disabled={!prevPage}
          onClick={() => fetchReceivedMessages(currentPage - 1)}
        >
          New Messages
        </button>
        <span className="text-xl mt-1 font-semibold">Page {currentPage}</span>
        <button
          className="px-6 py-2 bg-gray-700 text-white rounded text-lg disabled:opacity-50"
          disabled={!nextPage}
          onClick={() => fetchReceivedMessages(currentPage + 1)}
        >
          Older Messages
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AllReceivedMessages;

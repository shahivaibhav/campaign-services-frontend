import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminDashboard from "./SuperAdminDashboard";
import AdminDashboard from "./AdminDashboard";
import { FaSignOutAlt, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import Cookies from "js-cookie";
import AllReceivedMessages from "./PracticeUser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PBN_Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.user.role);

  const [campaigns, setCampaigns] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  let fetchCampaigns;

  if (role !== "practice user") {
    const userUrl =
      role === "super_admin"
        ? "http://127.0.0.1:8000/user-campaigns/api/campaign-superadmin/"
        : "http://127.0.0.1:8000/user-campaigns/api/campaign-admin/";

    fetchCampaigns = async (page = 1, search = "", order = "desc") => {
      const token = Cookies.get("access_token");
      if (!token) {
        console.error("Access token not found");
        return;
      }

      try {
        const response = await fetch(
          `${userUrl}?page=${page}&search=${search}&order=${order}&sort_by=created_at`,
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

        if (data.results.length === 0) {
          toast.info("No campaigns found with this search term", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
        }

        if(data.results.length && role === 'admin' && data.results[0].status === 'active') {
          toast.info("No pending campaigns found with this search term", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
        }

        setCampaigns(data.results);
        setNextPage(data.next);
        setPrevPage(data.previous);
        setCurrentPage(page);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch campaigns", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    };

    useEffect(() => {
      fetchCampaigns();
    }, []); // Runs once on mount
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      fetchCampaigns(1, e.target.value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  const handleFilterClick = (order) => {
    fetchCampaigns(1, searchQuery, order);
    setFilterMenuVisible(false); // Close filter menu after selection
  };

  const handleDeleteCampaign = (campaignId) => {
    setCampaigns((prev) => prev.filter((campaign) => campaign.id !== campaignId));
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <nav className="bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-blue-500">Practice by Numbers</h1>
            <div className="flex items-center space-x-4">
              {role && <span className="text-gray-400">Welcome, {role.replace("_", " ")}</span>}

              {/* Search Input */}
              {role !== "practice user" && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search Campaigns"
                    className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
                  />
                  <motion.button
                    className="px-3 py-2 bg-blue-600 text-white rounded flex items-center space-x-2 hover:bg-blue-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled
                  >
                    <FaSearch />
                    <span>Search</span>
                  </motion.button>
                </div>
              )}

              {role !== "practice user" && (
                <div className="relative">
                  <motion.button
                    className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterMenuVisible(!filterMenuVisible)}
                  >
                    Filter By
                  </motion.button>

                  {filterMenuVisible && (
                    <div className="absolute mt-2 bg-gray-700 rounded shadow-lg z-10">
                      <button
                        className="block px-4 py-2 text-white hover:bg-gray-600 w-full text-left"
                        onClick={() => handleFilterClick("desc")}
                      >
                        Newest First
                      </button>
                      <button
                        className="block px-4 py-2 text-white hover:bg-gray-600 w-full text-left"
                        onClick={() => handleFilterClick("asc")}
                      >
                        Oldest First
                      </button>
                    </div>
                  )}
                </div>
              )}

              <motion.button
                className="text-gray-400 hover:text-gray-100 flex items-center space-x-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {role === "super_admin" && (
          <SuperAdminDashboard campaigns={campaigns} onDelete={handleDeleteCampaign} />
        )}
        {role === "admin" && <AdminDashboard campaigns={campaigns} />}
        {role === "practice user" && <AllReceivedMessages />}

        {role !== "practice user" && (
          <div className="flex justify-center space-x-10 mt-6">
            <button
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              disabled={!prevPage}
              onClick={() => fetchCampaigns(currentPage - 1, searchQuery)}
            >
              Previous
            </button>
            <span className="text-lg mt-1 font-semibold">Page {currentPage}</span>
            <button
              className="px-6 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              disabled={!nextPage}
              onClick={() => fetchCampaigns(currentPage + 1, searchQuery)}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PBN_Dashboard;

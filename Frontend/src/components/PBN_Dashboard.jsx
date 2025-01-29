import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminDashboard from "./SuperAdminDashboard";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./PracticeUser";
import { FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

import Cookies from "js-cookie";
import AllReceivedMessages from "./PracticeUser";


const PBN_Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = useSelector((state) => state.user.role);

  useEffect(() => {
    const disableBackButton = (event) => {
      event.preventDefault()
      navigate('/dashboard');
    };

    window.addEventListener('popstate', disableBackButton);
    return () => {
      window.removeEventListener('popstate', disableBackButton)
    }
  }, [navigate])
  
  const [campaigns, setCampaigns] = useState([]);
  if(role != "practice user"){
  const userUrl = (role === "super_admin") ? "http://127.0.0.1:8000/user-campaigns/api/campaign-superadmin/" : "http://127.0.0.1:8000/user-campaigns/api/campaign-admin/";


  useEffect(() => {
    const fetchCampaigns = async () => {
      const token = Cookies.get("access_token");
      if (!token) {
        console.error("Access token not found");
        return;
      }
      try {
        const response = await fetch(
          userUrl,
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
}

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
            <h1 className="text-2xl font-bold text-blue-500">
              Practice by Numbers
            </h1>
            <div className="flex items-center space-x-4">
              {role && <span className="text-gray-400">Welcome, {role.replace("_", " ")}</span>}
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
      </main>
    </div>
  );
};

export default PBN_Dashboard;

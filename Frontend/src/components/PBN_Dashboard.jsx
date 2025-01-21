import React, { useState } from 'react'
import SuperAdminDashboard from './SuperAdminDashboard'
import AdminDashboard from './AdminDashboard'
import UserDashboard from './UserDashboard'
import { FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';


const PBN_Dashboard = () => {

  const location = useLocation()
  const { role } = location.state;
  const userRole = role
  const userEmail = useState('shahivaibhav1605@gmail.com')


    /* Array of many campaign i have to take from backend*/
    const campaigns = [
        {
            id : 1,
            name : "Vaibhav Shahi",
            description: "Free dental check-up till 26 january",
            status : "Active",
            targetUsers: ["xyz@example.com", "xyz@example.com"]
        },
        {
            id : 2,
            name : "Lakhan Shahi",
            description: "50% off on all dental insurances",
            status : "Active",
            targetUsers: ["xyz@example.com", "xyz@example.com"]
        },
        {
            id : 3,
            name : "Sanskriti Bhalla",
            description: "Register to enroll in free webinar",
            status : "Pending",
            targetUsers: ["xyz@example.com", "xyz@example.com"]
        },
    ]

    

    return (
        <div className="min-h-screen bg-gray-800 text-white">
          {/* Navigation */}
          <nav className="bg-gray-900 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16 items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-blue-500 animate__animated animate__fadeIn">
                    Practice by Numbers
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">Welcome {name}, {userRole.replace('_', ' ')}</span>
                  <motion.button
                    className="text-gray-400 hover:text-gray-100 flex items-center space-x-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </nav>
    
          {/* Main Content */}
          <main className="max-w-7xl mx-auto py-6 px-4">
            {userRole === 'super_admin' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <SuperAdminDashboard campaigns={campaigns} />
              </motion.div>
            )}
    
            {userRole === 'admin' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AdminDashboard campaigns={campaigns} />
              </motion.div>
            )}
    
            {userRole === 'practice_user' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <UserDashboard campaigns={campaigns} userEmail={userEmail} />
              </motion.div>
            )}
          </main>
        </div>
      );
    };
    
    export default PBN_Dashboard;
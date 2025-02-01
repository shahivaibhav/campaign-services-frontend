import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { toast ,ToastContainer} from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
const UserCampaigns = () => {
    const [formData, setFormData] = useState({
        type: "",
        text: "",
        description: "",
        status: "pending" // Default value
    });

    const navigate = useNavigate();

    const superAdminUrl = "http://127.0.0.1:8000/user-campaigns/api/campaign-superadmin/";
    const adminUrl = "http://127.0.0.1:8000/user-campaigns/api/campaign-admin/";

    const role = "super_admin"

    const submitHandler = async (e) => {
        e.preventDefault();
        const url = role === "admin" ? adminUrl : superAdminUrl;

        try {
            const token = Cookies.get("access_token");
            if (!token) {
                console.error("Access token not found");
                toast.error("Access token not found");
                return;
            }
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token}`
                },
                
                body: JSON.stringify({
                    type: formData.type,
                    text: formData.text,
                    description: formData.description,
                    status: formData.status
                })
            });

            if (response.ok) {
                toast.success("Campaign created successfully!");
                const jsonResponse = await response.json();
                console.log("Created a new campaign", jsonResponse);
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000); 
            }
        } catch (error) {
            console.log("error message: ", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    

    return (
        <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center">
            <ToastContainer/>
            <form onSubmit={submitHandler} className="bg-gray-700 p-6 rounded shadow-lg w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Text</label>
                    <input
                        type="text"
                        name="text"
                        value={formData.text}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default UserCampaigns;

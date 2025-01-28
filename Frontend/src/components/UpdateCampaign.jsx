import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast , ToastContainer} from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
import Cookies from "js-cookie";
const UpdateCampaign = () => {
    const { campaignId } = useParams(); // Get campaign ID from URL
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState({
        type: '',
        text:'',
        description: '',
        status: 'pending',
    });

    // Fetch campaign data
    

    const handleChange = (e) => {
        setCampaign({
            ...campaign,
            [e.target.name] : e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = Cookies.get("access_token");
        if (!token) {
            toast.error("Access token not found");
            console.error("Access token not found");
            return;
        }

        const response = await fetch(`http://127.0.0.1:8000/user-campaigns/api/campaign-superadmin/${campaignId}/`, {
            method: "PUT",
            headers: {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${token}`,
            },
           
            body: JSON.stringify(campaign),
        });

        if (response.ok) {
            toast.success('Campaign updated successfully!');
            console.log(response)
            const data = await response.json();
            console.log(data)

            navigate('/dashboard');
        } else {
            toast.error('Failed to update campaign.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-800 text-white">
            <div className="max-w-md mx-auto p-6 bg-[#212121] shadow rounded-lg">
                <h2 className="text-2xl font-bold text-gray-200 mb-4">Update Campaign</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400">Text</label>
                        <input
                            type="text"
                            name="text"
                            value={campaign.text}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-400">Type</label>
                        <input
                            type="text"
                            name="type"
                            value={campaign.type}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={campaign.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400">Status</label>
                        <select
                            name="status"
                            value={campaign.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded"
                        >
                            <option value="pending">Pending</option>
                            <option value="active">Active</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Update Campaign
                    </button>
                </form>
            </div>
            {/* Toast container */}
            <ToastContainer />
        </div>
    );
};

export default UpdateCampaign

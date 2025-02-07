import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ExistingPracticeUser = () => {
  const navigate = useNavigate()
  const [practiceUsers, setPracticeUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roles: 'practice user',
    is_new_practice: false,
    practice_id: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch the list of practice users from the backend
  useEffect(() => {
    const fetchPracticeUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/users/all-practice-users/");
        if (response.ok) {
          const data = await response.json();
          setPracticeUsers(data);
          setLoading(false);
        } else {
          console.error("Error fetching practice users:", response.statusText);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchPracticeUsers();
  }, []);

  // Handle the change in selected user
  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    const user = practiceUsers.find((user) => user.id === parseInt(userId));
    setSelectedUser(user);

    // Fill in the form data with the selected user's information
    if (user) {
      setFormData({
        ...formData,
        username: user.name, // Assuming name is the username
        email: user.email, // Assuming email is part of user data
        password: '', // Set a default password or prompt the user for it
        practice_id: user.id // Assign practice_id as selected user ID
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the form data to your backend
    try {
      const response = await fetch('http://127.0.0.1:8000/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Successfully submitted:", data);
    
        navigate('/auth')
      } else {
        console.error("Error submitting form:", response.statusText);
        // Handle errors if any
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white mb-2">Associate with Existing Practice</h2>
          <p className="text-sm text-gray-400 mb-8">Select an existing user to associate with a practice</p>
        </div>

        {loading ? (
          <p className="text-white text-center">Loading practice users...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Select Existing Practice User</label>
              <select
                name="existing_practice_user"
                value={selectedUserId}
                onChange={handleUserChange}
                className="mt-1 block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                required
              >
                <option value="">Select a User</option>
                {practiceUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="mt-1 block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                Submit and Associate
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ExistingPracticeUser;

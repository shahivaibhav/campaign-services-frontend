import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserDashboard from './UserDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';
import AdminDashboard from './AdminDashboard';
import PBN_Dashboard from './PBN_Dashboard';
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../redux/userSlice'

const AuthPage = () => {
  const RegisterUserEnd = "http://127.0.0.1:8000/users/register/";
  const LoginUserEnd = "http://127.0.0.1:8000/users/login/";


  const [isSignUp, setIsSignUp] = useState(true);
  const [formdata, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    roles: "practice user",
  });

  const navigate = useNavigate();  // Initialize the navigate function
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endPoint = isSignUp ? RegisterUserEnd : LoginUserEnd;

    try {
      const response = await fetch(endPoint , {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          password: formdata.password,
          ...(isSignUp
            ? {
                email: formdata.email,
                first_name: formdata.first_name,
                last_name: formdata.last_name,
                username: formdata.username,
                roles: formdata.roles,
              }
            : {
                username: formdata.username,
              }),
        }),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log("Success in authentication ", jsonResponse);

        if (isSignUp) {
          // If it's a sign-up, redirect to the sign-in page after successful registration
          setIsSignUp(false);
        } else {
          // Store the role in localStorage after login
          localStorage.setItem("role", jsonResponse.role);

          dispatch(
            loginSuccess({
              role: jsonResponse.role,
              email: jsonResponse.email,
            })
          );
          navigate('/dashboard')
        }
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-900 p-10 rounded-xl shadow-lg">
        {/* Logo/Brand Section */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white mb-2">Practice by Numbers</h2>
          <p className="text-sm text-gray-400 mb-8">
            {isSignUp ? "Please register your account" : "Please sign-in to Login"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md space-y-4">
            {/* Sign Up Fields */}
            {isSignUp && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formdata.first_name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    required
                    
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formdata.last_name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    required
                  />
                </div>
              </div>
            )}

            {/* Common Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Username</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="username"
                  value={formdata.username}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formdata.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={formdata.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                required
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-300">Roles</label>
                <select
                  name="roles"
                  value={formdata.roles}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                  required
                >
                  <option value="practice_user">Practice User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            )}
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
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">
                {isSignUp ? "Already have an account?" : "New to Practice by Numbers?"}
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition duration-150"
            >
              {isSignUp ? "Sign in to your account" : "Create a new account"}
            </button>
          </div>
          
          {/* Forgot Password Link */}
          {!isSignUp && (
            <div className="mt-4 text-center">
              <a
                href="/auth/rest-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition duration-150"
              >
                Forgot your password?
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

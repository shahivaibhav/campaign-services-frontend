import { React, useEffect } from 'react'
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const App = () => {
  
  const navigate = useNavigate()
  useEffect(() => {
    const token = Cookies.get("access_token")

    if(token && window.location.pathname === '/'){
      navigate('/dashboard')
    }
    
  }, [navigate])
  const features = [
    {
      title: "Campaign Planning",
      description:
        "Streamline your campaign planning with intuitive tools and templates",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      title: "Analytics Dashboard",
      description:
        "Track your campaign performance with real-time analytics and insights",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "Team Collaboration",
      description: "Work seamlessly with your team members in real-time",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: "VOIP",
      description: "Contact Practices anytime and anywhere",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10c1.4 2.8 3.6 5 6.4 6.4l2-2a1.5 1.5 0 011.6-.4c1.2.4 2.4.6 3.6.6a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5A16.5 16.5 0 013 3.5 1.5 1.5 0 014.5 2h3A1.5 1.5 0 019 3.5c0 1.2.2 2.4.6 3.6a1.5 1.5 0 01-.4 1.6l-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Additional Features",
      description: "Other Features we offer",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 5a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      ),
    },
    {
      title: "Where are we now?",
      description: "10+ years of trust with 5000+ customers",
      icon: () => (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2l7 4v5c0 5.25-3.75 9.75-7 12-3.25-2.25-7-6.75-7-12V6l7-4z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="dark">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition duration-500">
        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Practice by Numbers
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center space-x-4">
                    <NavLink to="/features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-300">
                      Features
                    </NavLink>
                    <NavLink to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-300">
                      Pricing
                    </NavLink>
                    <NavLink to="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-300">
                      About
                    </NavLink>
                    <NavLink to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-300">
                      Contact
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative bg-white dark:bg-gray-800 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white dark:bg-gray-800 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
                <div className="text-center">
                  <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                    <span className="block">Our Platform for</span>
                    <span className="block text-blue-600 dark:text-blue-400">
                      Practices and Patients
                    </span>
                  </h2>
                  <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Streamline your campaign planning, execution, and analysis
                    with our comprehensive management platform. Take control of
                    your success today.
                  </p>
                  <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                    <div className="rounded-md shadow">
                      <NavLink
                        to="/auth"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 md:py-4 md:text-lg md:px-10 transform transition duration-300 hover:scale-105"
                      >
                        Get Started
                      </NavLink>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <NavLink
                        to="/demo"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 md:py-4 md:text-lg md:px-10 transform transition duration-300 hover:scale-105"
                      >
                        Watch Demo
                      </NavLink>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 bg-gray-50 dark:bg-gray-800 transition duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Why Choose Practice by Numbers?
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
                Our platform provides everything to manage Practices
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="relative bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 transform hover:scale-105"
                  >
                    <div className="text-blue-600 dark:text-blue-400 mb-4">
                      <feature.icon />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 dark:bg-blue-400">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block">Start your free trial today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              Join thousands of successful campaign managers who trust Practice by Numbers.
            </p>
            <NavLink
              to="/auth"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 sm:w-auto transform transition duration-300 hover:scale-105"
            >
              Sign up for free
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
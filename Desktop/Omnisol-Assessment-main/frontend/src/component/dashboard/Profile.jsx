import { useEffect, useState } from "react";
import axios from "axios";
import { backendPortURL } from "../../config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser, FiMail, FiLock, FiCheck, FiEdit2 } from "react-icons/fi";
import { toast } from "react-hot-toast";

const Profile = () => {
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useSelector((state) => state.currentUser.data);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") setFormData((prev) => ({ ...prev, password: value }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        `${backendPortURL}/user/update/${currentUser?._id}`,
        formData,
        { withCredentials: true }
      );
      toast.success("Profile updated successfully");
      navigate('/user/dashboard')
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-200 rounded-full -ml-24 -mb-24 opacity-20"></div>
          
          {/* Header */}
          <div className="relative bg-white px-8 pt-8 pb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
            >
              <FiArrowLeft className="mr-2" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Profile Settings</h2>
                <p className="mt-2 text-gray-600">Manage your account information</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiUser className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="relative px-8 pb-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FiUser className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FiMail className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FiLock className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all ${
                    showPasswordFields
                      ? "text-red-600 bg-red-50 hover:bg-red-100"
                      : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                  }`}
                >
                  <FiEdit2 size={14} />
                  {showPasswordFields ? "Cancel Password Change" : "Change Password"}
                </button>
              </div>

              {showPasswordFields && (
                <div className="space-y-6 mt-4 animate-fadeIn">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FiLock className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                        placeholder="Enter your old password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FiLock className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                        placeholder="Enter your new password"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Password should be at least 8 characters long
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleUpdateProfile}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all ${
                    isLoading
                      ? "bg-green-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck className="text-lg" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
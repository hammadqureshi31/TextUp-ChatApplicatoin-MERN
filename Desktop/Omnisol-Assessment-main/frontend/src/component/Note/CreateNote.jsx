import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendPortURL } from '../../config';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiPlus } from 'react-icons/fi';

const CreateNote = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [protectedNote, setProtectedNote] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${backendPortURL}/api/new-note`, {
        title,
        description,
        protected: protectedNote,
        password: protectedNote ? password : undefined,
      });

      toast.success('Note created successfully!');
      setTitle('');
      setDescription('');
      setProtectedNote(false);
      setPassword('');
      navigate('/user/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create note');
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
                <h2 className="text-3xl font-bold text-gray-900">Create New Note</h2>
                <p className="mt-2 text-gray-600">Capture your thoughts and ideas securely</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiPlus className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="relative px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  placeholder="What's this note about?"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                  placeholder="Write your thoughts here..."
                  required
                ></textarea>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={protectedNote}
                    onChange={() => setProtectedNote(!protectedNote)}
                    id="protected"
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FiLock className="text-blue-600" />
                  <label htmlFor="protected" className="text-sm font-medium text-gray-700">
                    Password protect this note
                  </label>
                </div>
              </div>

              {protectedNote && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
                    placeholder="Enter a secure password"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters recommended
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all flex items-center justify-center ${
                  isLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Creating...
                  </>
                ) : (
                  'Create Note'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;
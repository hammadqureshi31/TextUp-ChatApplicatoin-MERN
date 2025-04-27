import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { backendPortURL } from "../../config";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotes } from "../../redux/slices/noteSlice";
import { FiLock, FiUnlock, FiSave, FiArrowLeft } from "react-icons/fi";

const EditNote = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    protected: false,
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();
  const { noteId } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser.data);
  const { notes } = useSelector((state) => state.notes.data);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        if (!noteId) return;
        const existingNote = notes?.find((note) => note._id === noteId);

        if (existingNote) {
          setFormData({
            title: existingNote.title,
            description: existingNote.description,
            protected: existingNote.protected || false,
            password: "",
          });
        }
        //  else {
        //       const res = await axios.get(`${backendPortURL}/api/notes/${noteId}`);
        //       setFormData({
        //         title: res.data.title,
        //         description: res.data.description,
        //         protected: res.data.protected || false,
        //         password: "",
        //       });
        //     }
      } catch (error) {
        toast.error("Failed to load note");
        console.error("Error fetching note:", error);
        navigate("/user/dashboard");
      } finally {
        setIsFetching(false);
      }
    };

    fetchNote();
  }, [noteId, notes, navigate]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        protected: formData.protected,
        password: formData.password || "",
      };

      const editResp = await axios.put(
        `${backendPortURL}/api/edit-note/${noteId}`,
        payload
      );

      toast.success("Note updated successfully!");
      const page = parseInt(sessionStorage.getItem("page"));
      dispatch(fetchNotes(page));
      navigate("/user/dashboard");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error(error.response?.data?.message || "Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Notes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <h2 className="text-2xl font-bold text-white">Edit Note</h2>
          <p className="text-blue-100 mt-1">
            {formData.protected ? (
              <span className="flex items-center">
                <FiLock className="mr-1" /> Protected Note
              </span>
            ) : (
              <span className="flex items-center">
                <FiUnlock className="mr-1" /> Public Note
              </span>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Note title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Write your note content here..."
              required
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="protected"
                name="protected"
                type="checkbox"
                checked={formData.protected}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="protected" className="font-medium text-gray-700">
                Password protect this note
              </label>
              <p className="text-gray-500">
                Only users with the password will be able to view this note
              </p>
            </div>
          </div>

          {formData.protected && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {noteId ? "New Password" : "Password *"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Set a password"
                minLength={4}
                required={formData.protected}
              />
              <p className="mt-2 text-sm text-gray-500">
                {noteId && "Leave blank to keep current password."}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  <FiSave className="mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNote;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteNote, fetchNotes } from "../../redux/slices/noteSlice";
import toast from "react-hot-toast";
import bcrypt from "bcryptjs";
import {
  FiEdit2,
  FiTrash2,
  FiClock,
  FiUser,
  FiLock,
  FiX,
  FiChevronDown,
  FiRotateCcw,
  FiEye,
  FiChevronUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendPortURL } from "../../config";

const NoteCard = ({ note }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser.data);
  const [showNote, setShowNote] = useState(false);
  const [passValue, setPassValue] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState([]);
  const [hoveredVersion, setHoveredVersion] = useState(null);
  const [previewedVersion, setPreviewedVersion] = useState(null);
  const [isReverting, setIsReverting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const navigate = useNavigate();
  const isOwner = currentUser?._id === note?.createdBy;

  // Handle long text with ellipsis and expand functionality
  const TextWithExpand = ({ text, maxLength = 100 }) => {
    const [expanded, setExpanded] = useState(false);

    if (!text) return null;

    if (text.length <= maxLength || expanded) {
      return (
        <div className="whitespace-pre-wrap">
          {text}
          {text.length > maxLength && (
            <button
              onClick={() => setExpanded(false)}
              className="text-blue-600 text-sm ml-2 hover:text-blue-800 transition-colors"
            >
              Show less
            </button>
          )}
        </div>
      );
    }

    return (
      <div>
        {text.substring(0, maxLength)}...
        <button
          onClick={() => setExpanded(true)}
          className="text-blue-600 text-sm ml-1 hover:text-blue-800 transition-colors"
        >
          Show more
        </button>
      </div>
    );
  };

  const handleDelete = () => {
    if (!isOwner) {
      toast.error("You don't have permission to delete this note");
      return;
    }

    dispatch(deleteNote(note._id))
      .unwrap()
      .then(() => {
        toast.success("Note deleted successfully");
        setIsModalOpen(false);
      })
      .catch(() => toast.error("Failed to delete note"));
  };

  const handleRevertVersion = async (version) => {
    setIsReverting(true);
    try {
      const payload = {
        title: version.title,
        description: version.description,
        protected: note.protected,
        password: note.password || "",
      };

      await axios.put(`${backendPortURL}/api/edit-note/${note?._id}`, payload);

      toast.success("Note reverted successfully!");
      const page = parseInt(sessionStorage.getItem("page"));
      dispatch(fetchNotes(page - 1));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error reverting note:", error);
      toast.error(error.response?.data?.message || "Failed to revert note");
    } finally {
      setIsReverting(false);
    }
  };

  const handlePreviewVersion = (version) => {
    setPreviewedVersion(previewedVersion?.id === version.id ? null : version);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const isMatch = await bcrypt.compare(passValue, note.password);
      if (isMatch) {
        setShowNote(true);
        setPasswordError("");
      } else {
        setPasswordError("Incorrect password");
      }
    } catch (error) {
      setPasswordError("Error verifying password");
      console.error("Password comparison error:", error);
    }
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 200);
  };

  useEffect(() => {
    const fetchNoteVersions = async () => {
      if (showVersions) {
        try {
          const { data } = await axios.get(
            `${backendPortURL}/api/versions/${note._id}`
          );
          setVersions(data.versions || []);
        } catch (error) {
          toast.error("Failed to load versions");
          console.error("Error fetching versions:", error);
        }
      }
    };

    fetchNoteVersions();
  }, [showVersions, note._id]);

  if (note.protected && !showNote && !isOwner) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="flex items-center gap-3 mb-3">
          <FiLock className="text-blue-500" />
          <h3 className="text-lg font-medium text-gray-800">Protected Note</h3>
        </div>
        <p className="text-gray-600 mb-4">Enter password to view this note</p>

        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <input
            type="password"
            value={passValue}
            onChange={(e) => setPassValue(e.target.value)}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all"
            placeholder="Enter password"
            required
          />
          {passwordError && (
            <p className="text-red-500 text-sm animate-shake">{passwordError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            Unlock Note
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      {/* Note Card */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer h-full flex flex-col group"
      >
        <div className="p-5 flex-grow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {note.title}
            </h3>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-3">
            {note.description}
          </p>
        </div>

        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
          <div className="flex justify-between items-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors">
              <FiClock className="" />
              <span>History</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`edit-note/${note._id}`);
                }}
                disabled={!isOwner}
                className={`p-2 rounded-lg transition-colors ${
                  isOwner
                    ? "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                title="Edit note"
              >
                <FiEdit2 />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={!isOwner}
                className={`p-2 rounded-lg transition-colors ${
                  isOwner
                    ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                title="Delete note"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Note Detail Modal */}
      {isModalOpen && (
        <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}>
          <div 
            className={`bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-200 overflow-hidden transform transition-all ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
              <div className="max-w-[90%]">
                <h3 className="text-xl font-bold text-gray-800 truncate">
                  {note.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {note.protected && (
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      <FiLock size={12} /> Protected
                    </span>
                  )}
                  <span className="text-xs text-gray-500 truncate">
                    Last updated: {new Date(note.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-grow">
              {/* Current Note Content */}
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Current Content
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all hover:border-blue-200">
                  <h5 className="font-medium text-gray-800 mb-2">
                    {note.title}
                  </h5>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    <TextWithExpand text={note.description} />
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-8">
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <FiUser className="text-lg" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Created by</p>
                    <p className="truncate">{note.createdBy || "Unknown"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <FiClock className="text-lg" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Created at</p>
                    <p>{new Date(note.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Version History (left as is) */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={() => setShowVersions(!showVersions)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
                >
                  {showVersions ? <FiChevronUp /> : <FiChevronDown />}
                  <span className="font-medium">Version History</span>
                </button>

                {showVersions && (
                  <div className="mt-6">
                    {versions.length > 0 ? (
                      <div className="space-y-4">
                        {versions.map((version, index) => {
                          const versionKey = `${version.updatedAt}_${index}`;
                          const isCurrent = index === 0;
                          const isHovered = hoveredVersion === versionKey;

                          return (
                            <div
                              key={versionKey}
                              className={`relative p-5 rounded-xl transition-all duration-200 ${
                                isHovered
                                  ? "bg-gradient-to-br from-blue-50/50 to-purple-50/50 border border-blue-200 shadow-sm"
                                  : "bg-white border border-gray-100"
                              }`}
                              onMouseEnter={() => setHoveredVersion(versionKey)}
                              onMouseLeave={() => setHoveredVersion(null)}
                            >
                              {/* Version Header */}
                              <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-3">
                                  <div
                                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                      isCurrent
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    <span className="font-medium text-sm">
                                      v{versions.length - index}
                                    </span>
                                  </div>

                                  <div className="min-w-0">
                                    <h4 className="text-md font-semibold text-gray-800 truncate">
                                      {version.title || "Untitled Version"}
                                    </h4>
                                    <div className="flex items-center mt-1 space-x-2">
                                      <span className="text-xs text-gray-500">
                                        {new Date(
                                          version.updatedAt
                                        ).toLocaleString()}
                                      </span>
                                      {isCurrent && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                          most recent
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                {isHovered && isOwner && (
                                  <div className="flex space-x-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRevertVersion(version);
                                        }}
                                        disabled={isReverting}
                                        className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 text-sm transition-colors ${
                                          isReverting
                                            ? "bg-gray-100 text-gray-500"
                                            : "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200"
                                        }`}
                                      >
                                        {isReverting ? (
                                          <svg
                                            className="animate-spin h-4 w-4 text-blue-500"
                                            viewBox="0 0 24 24"
                                          >
                                            <circle
                                              cx="12"
                                              cy="12"
                                              r="10"
                                              fill="none"
                                              strokeWidth="4"
                                              className="opacity-25"
                                              stroke="currentColor"
                                            ></circle>
                                            <path
                                              className="opacity-75"
                                              fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                          </svg>
                                        ) : (
                                          <FiRotateCcw size={14} />
                                        )}
                                        <span>
                                          {isReverting
                                            ? "Reverting..."
                                            : "Revert"}
                                        </span>
                                      </button>
                                  </div>
                                )}
                              </div>

                              {/* Version Preview */}
                              {previewedVersion?.id === version.id && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                      <FiEye className="mr-1.5" />
                                      Version Preview
                                    </h5>
                                    <div className="prose prose-sm max-w-none text-gray-600">
                                      {version.description ? (
                                        <TextWithExpand
                                          text={version.description}
                                          maxLength={200}
                                          className="whitespace-pre-wrap"
                                        />
                                      ) : (
                                        <p className="text-gray-400 italic">
                                          No description available
                                        </p>
                                      )}
                                    </div>
                                    <div className="mt-3 text-xs text-gray-500">
                                      <span className="font-medium">
                                        Last updated:
                                      </span>{" "}
                                      {new Date(
                                        version.updatedAt
                                      ).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Hover Info */}
                              {isHovered && isOwner && !isCurrent && (
                                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                                  <div className="flex items-start space-x-2">
                                    <FiClock className="flex-shrink-0 mt-0.5" />
                                    <p>
                                      This version was saved on{" "}
                                      <span className="font-medium">
                                        {new Date(
                                          version.updatedAt
                                        ).toLocaleDateString()}
                                      </span>
                                      . Reverting will restore the note to this
                                      state.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <FiClock className="text-gray-400 text-xl" />
                        </div>
                        <h4 className="text-gray-500 font-medium">
                          No version history
                        </h4>
                        <p className="text-gray-400 text-sm mt-1">
                          Previous versions of this note will appear here
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => {
                  closeModal();
                  navigate(`edit-note/${note._id}`);
                }}
                disabled={!isOwner}
                className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
                  isOwner
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FiEdit2 size={16} />
                <span>Edit Note</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;
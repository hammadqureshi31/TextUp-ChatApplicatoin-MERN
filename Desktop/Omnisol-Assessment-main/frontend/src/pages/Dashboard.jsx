import React, { useEffect, useState } from "react";
import DashboardNavbar from "../component/dashboard/DashboardNavbar";
import { useSocket } from "../context/SocketContext";
import toast, { Toaster } from "react-hot-toast";
import NoteCardWrapper from "../component/Note/NoteCardWrapper";
import PageControl from "../component/Pagination/PageControl";
import { fetchNotes } from "../redux/slices/noteSlice";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const notesData = useSelector((state)=>state.notes.data);

  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchNotes(page));
  }, [dispatch, page, socket]);

  useEffect(()=>{
    console.log("notes updated");
  },[notesData])

  useEffect(() => {
    const handleNoteCreated = ({ title, createdBy }) => {
      toast.success(`New note "${title}" created by ${createdBy}`);
    };

    const handleNoteDeleted = ({ title, deletedBy }) => {
      toast.success(`Note ${title}`);
      // dispatch(fetchNotes(page));
    };

    socket.on("noteCreated", handleNoteCreated);
    socket.on("noteDeleted", handleNoteDeleted);

    return () => {
      socket.off("noteCreated", handleNoteCreated);
      socket.off("noteDeleted", handleNoteDeleted);
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <Toaster position="top-right" />
      <main className="container mx-auto px-4 py-8 mt-14">
        <NoteCardWrapper />
      </main>
      {notesData && <PageControl page={page} setPage={setPage} />}
    </div>
  );
};

export default Dashboard;

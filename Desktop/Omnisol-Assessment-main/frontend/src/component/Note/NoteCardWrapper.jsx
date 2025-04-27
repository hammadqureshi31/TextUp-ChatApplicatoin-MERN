import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoteCard from "./noteCard";
// import LoadingSpinner from "../common/LoadingSpinner";

const NoteCardWrapper = () => {
  const { data, loading, error } = useSelector((state) => state.notes);

  console.log(data?.notes);

//   if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center">Error loading notes: {error}</div>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data?.notes?.length > 0 ? (
        data?.notes.map((note) => <NoteCard key={note?._id} note={note} />)
      ) : (
        <div className="col-span-full py-12 text-center">
          <p className="text-gray-500 text-lg">No notes available yet</p>
          <p className="text-gray-400">Create your first note to get started!</p>
        </div>
      )}
    </div>
  );
};

export default NoteCardWrapper;
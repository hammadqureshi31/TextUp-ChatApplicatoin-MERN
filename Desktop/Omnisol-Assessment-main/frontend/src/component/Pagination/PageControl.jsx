import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes } from '../../redux/slices/noteSlice';
import ReactPaginate from 'react-paginate';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import LoadingSpinner from '../common/LoadingSpinner';

const PageControl = ({page, setPage}) => {
  const {
    pagination
  } = useSelector((state) => state.notes.data);
  


  const handlePageClick = ({ selected }) => {
    sessionStorage.setItem("page", selected || page);
    setPage(selected);
  };

//   if (loading && !notes?.length) return <LoadingSpinner />;

  return (
    <div className="space-y-6 flex flex-col justify-center items-center text-center pt-10 relative">
      
      {pagination?.totalCount > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 absolute top-1 ">
            Showing {(page * pagination.limit) + 1} -{' '}
            {Math.min(
              (page + 1) * pagination.limit,
              pagination.totalCount
            )}{' '}
            of {pagination.totalCount} notes
          </div>

          <ReactPaginate
            previousLabel={<FiChevronLeft className="h-5 w-5" />}
            nextLabel={<FiChevronRight className="h-5 w-5" />}
            breakLabel={'...'}
            pageCount={pagination?.totalPages || 0}
            forcePage={page}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={'flex items-center space-x-1'}
            pageClassName={'flex items-center justify-center'}
            pageLinkClassName={
              'w-8 h-8 text-sm flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100'
            }
            activeClassName={'bg-blue-500 text-white'}
            activeLinkClassName={
              'w-8 h-8 text-sm flex items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-600'
            }
            previousClassName={'flex items-center justify-center'}
            previousLinkClassName={
              'w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100'
            }
            nextClassName={'flex items-center justify-center'}
            nextLinkClassName={
              'w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100'
            }
            breakClassName={'flex items-center justify-center'}
            breakLinkClassName={
              'w-8 h-8 flex items-center justify-center rounded-md border border-gray-300'
            }
            disabledClassName={'opacity-50 cursor-not-allowed'}
          />
        </div>
      )}
    </div>
  );
};

export default PageControl;
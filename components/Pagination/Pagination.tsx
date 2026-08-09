import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  return (
    <div className={css.paginationContainer}>
      <ReactPaginate
        previousLabel={"←"}
        nextLabel={"→"}
        breakLabel={"..."}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        forcePage={currentPage - 1}

        containerClassName={css.pagination}
        pageClassName={css.pageItem}
        pageLinkClassName={css.pageLink}
        previousClassName={css.pageItem}
        previousLinkClassName={css.pageLink}
        nextClassName={css.pageItem}
        nextLinkClassName={css.pageLink}
        breakClassName={css.pageItem}
        breakLinkClassName={css.pageLink}
        activeClassName={css.active}
        disabledClassName={css.disabled}
      />
    </div>
  );
};

export default Pagination;

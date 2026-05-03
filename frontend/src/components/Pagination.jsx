import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  // Show up to 5 page numbers centered around current page
  function getPages() {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  return (
    <div className="pagination-wrap">
      <button
        className="page-btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <RiArrowLeftSLine /> Prev
      </button>

      {getPages().map((p) => (
        <button
          key={p}
          className={`page-btn${p === page ? " active" : ""}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="page-btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next <RiArrowRightSLine />
      </button>
    </div>
  );
}
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface PaginationProps {
  currentPages: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPages,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    if (currentPages <= 3) return pages.slice(0, 5);
    if (currentPages >= totalPages - 2) return pages.slice(totalPages - 5);
    return pages.slice(currentPages - 3, currentPages + 2);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1e1e1c]">
      <p className="text-[11px] text-neutral-700 font-mono">
        Page {currentPages} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        {/* Prev button */}
        <button
          onClick={() => onPageChange(currentPages - 1)}
          disabled={currentPages === 1}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-neutral-900 text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <MdChevronLeft size={14} />
        </button>

        {/* First page + ellipsis */}
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-[11px] border border-neutral-900 text-neutral-500 hover:bg-neutral-900 transition-colors"
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="text-neutral-700 text-[11px] px-1">...</span>
            )}
          </>
        )}

        {/* Page buttons */}
        {visiblePages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-7 h-7 flex items-center justify-center rounded-md text-[11px] border transition-colors ${
              p === currentPages
                ? "border-blue-800 bg-blue-950 text-blue-400"
                : "border-neutral-900 text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300"
            }`}
          >
            {p}
          </button>
        ))}

        {/* Last page + ellipsis */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="text-neutral-700 text-[11px] px-1">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-[11px] border border-neutral-900 text-neutral-500 hover:bg-neutral-900 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPages + 1)}
          disabled={currentPages === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-neutral-900 text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <MdChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

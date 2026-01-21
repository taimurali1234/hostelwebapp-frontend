type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function UserPagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12">

      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded-full border 
        hover:bg-[#2f9a8a] cursor-pointer hover:text-white 
        transition disabled:opacity-40 disabled:hover:bg-white"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 rounded-full cursor-pointer border text-sm font-medium 
          transition ${
            p === page
              ? "bg-[#2f9a8a] text-white"
              : "hover:bg-[#2f9a8a] hover:text-white"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-full border 
        hover:bg-[#2f9a8a] cursor-pointer hover:text-white 
        transition disabled:opacity-40 disabled:hover:bg-white"
      >
        Next
      </button>
    </div>
  );
}

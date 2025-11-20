"use client";

import { ITEM_PER_PAGE } from "@/lib/setting";
import { useRouter } from "next/navigation";

const Pagination = ({ page, count, itemPerPage }: { page: number, count: number, itemPerPage?: number }) => {
  const router = useRouter();
  const totalPage = Math.ceil(count / (itemPerPage ?? ITEM_PER_PAGE));
  const hasPrev = (itemPerPage ?? ITEM_PER_PAGE) * (page - 1) > 0;
  const hasNext = (itemPerPage ?? ITEM_PER_PAGE) * (page - 1) + (itemPerPage ?? ITEM_PER_PAGE) < count;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i++) pages.push(i);
    } else {
      if (page <= 2) {
        pages.push(1, 2, 3, "...", totalPage);
      } else if (page >= totalPage - 1) {
        pages.push(1, "...", totalPage - 2, totalPage - 1, totalPage);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPage);
      }
    }

    return pages;
  };

  return (
    <div className="p-4 flex flex-col md:flex-row gap-2 items-center justify-center sm:justify-between text-gray-500">
      <button
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold hover:cursor-pointer hover:not-disabled:bg-primary disabled:opacity-50  disabled:cursor-not-allowed"
        onClick={() => { changePage(page - 1) }}
        disabled={!hasPrev}
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {getPageNumbers().map((p, index) =>
          typeof p === "string" ? (
            <span key={index} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={index}
              className={`px-2 rounded-sm hover:bg-primary cursor-pointer ${page === p ? "bg-primary" : ""}`}
              onClick={() => { changePage(p) }}
            >
              {p}
            </button>
          )
        )}
      </div>
      <button
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold hover:cursor-pointer hover:bg-primary disabled:opacity-50  disabled:cursor-not-allowed"
        onClick={() => { changePage(page + 1) }}
        disabled={!hasNext}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

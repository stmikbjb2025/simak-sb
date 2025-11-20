"use client";

import { useRouter } from "next/navigation";
import React from "react";

const FilterSearch = ({ data }: { data: any }) => {
  const router = useRouter();

  const handleClik = (itemFilter: any) => {
    const params = new URLSearchParams(window.location.search);
    if (itemFilter === 'all') {
      params.delete("filter");
      params.delete("search");
    } else {
      params.set("filter", itemFilter);
    };
    params.delete("page");
    router.push(`${window.location.pathname}?${params}`);
  };
  return (
    <>
      <div className="flex items-end justify-between my-4">
        <div className="flex flex-row flex-wrap  gap-2 w-full md:w-auto">
          {data.map((item: { name: string; id: string }) => (
            <div
              key={item.id}
              onClick={() => handleClik(item.id)}
              className={`text-xs py-2 px-4 text-gray-900 rounded-full cursor-pointer capitalize ${item.id === 'all' ? "bg-gray-100" : "even:bg-primary-light odd:bg-secondary-light"}`}
            >
              {item.name || ""}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FilterSearch;

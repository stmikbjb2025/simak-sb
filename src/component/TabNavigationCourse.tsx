"use client";

import { usePathname, useRouter } from "next/navigation";

interface Tab {
  href: string;
  label: string;
};

const TabNavigation = ({ tabs }: { tabs: Tab[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="w-full px-4 pt-4">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => router.push(tab.href)}
          className={`py-2 px-3 text-[12px] md:text-sm  ${pathname.includes(tab.href)
            ? "border-b-4 border-primary text-emerald-800 font-bold"
            : "border-transparent text-gray-500 hover:text-primary font-medium"
            }`
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default TabNavigation;
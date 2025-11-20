'use client';

import { logout } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  title: string;
  items: {
    icon: string;
    label: string;
    href: string;
  }[]
};


const Sidebar = ({ menuItems }: { menuItems: MenuItem[] }) => {
  const pathname = usePathname();
  return (
    <div className="mt-4 text-sm mb-10">
      <div className="flex flex-col gap-2">
        <span className="hidden lg:block text-gray-400 font-light my-4"></span>
        <Link
          className={`flex items-center justify-start md:justify-center lg:justify-start  gap-4 w-full text-gray-400 py-2 md:px-2 rounded-md hover:bg-primary-light/50 ${pathname === "/" ? "md:bg-primary-light" : ""}`}
          href={"/"}
        >
          <Image src={"/icon/dashboard.svg"} width={20} height={20} alt={"Dashboard"} />
          <span className={`md:hidden lg:block ${pathname === "/" ? "text-black font-semibold" : ""}`}>{"Dashboard"}</span>
        </Link>
      </div>
      {menuItems.map(el => (
        el.items.length > 0 ? (
          <div className="flex flex-col gap-2" key={el.title}>
            <span className="md:hidden lg:block text-gray-400 font-light my-4">
              {el.title}
            </span>

            {
              el.items.map(item => (
                <Link
                  className={`flex items-center justify-start md:justify-center lg:justify-start  gap-4 w-full text-gray-400 py-2 md:px-2 rounded-md hover:bg-primary-light/50 ${pathname === item.href ? "md:bg-primary-light" : ""}`}
                  href={item.href}
                  key={item.href}
                >
                  <Image src={item.icon} width={20} height={20} alt={item.label} />
                  <span className={`md:hidden lg:block ${pathname === item.href ? "text-black font-semibold" : ""}`}>{item.label}</span>
                </Link>
              ))
            }
          </div>
        ) : null
      ))}
      <div className="flex flex-col gap-2">
        <span className="md:hidden lg:block text-gray-400 font-light my-4">LAINNYA</span>
        <Link
          className={`flex items-center justify-start md:justify-center lg:justify-start  gap-4 w-full text-gray-400 py-2 md:px-2 rounded-md hover:bg-primary-light/50 ${pathname === "/profile" ? "md:bg-primary-light" : ""}`}
          href={"/list/profile"}
        >
          <Image src={"/icon/profile.svg"} width={20} height={20} alt={"Profile"} />
          <span className={`md:hidden lg:block ${pathname === "/profile" ? "text-black font-semibold" : ""}`}>{"Profile"}</span>
        </Link>
        <Link
          className={`flex items-center justify-start md:justify-center lg:justify-start  gap-4 w-full text-gray-400 py-2 md:px-2 rounded-md hover:bg-primary-light/50 ${pathname === "/settings" ? "md:bg-primary-light" : ""}`}
          href={"/list/settings"}
        >
          <Image src={"/icon/setting.svg"} width={20} height={20} alt={"Settings"} />
          <span className={`md:hidden lg:block ${pathname === "/settings" ? "text-black font-semibold" : ""}`}>{"Setting"}</span>
        </Link>
        <form
          action={logout}
          className={`flex items-center justify-start md:justify-center lg:justify-start  gap-4 w-full text-gray-400 py-2 md:px-2 rounded-md hover:cursor-pointer hover:bg-primary-light/50`}
        >
          <button
            type="submit"
            className={`flex items-center justify-start md:justify-center lg:justify-start  gap-4 w-full text-gray-400 rounded-md hover:cursor-pointer`}
          >
            <Image src={"/icon/logout.svg"} width={20} height={20} alt={"Logout"} />
            <span className={`md:hidden lg:block`}>{"Logout"}</span>
          </button>
        </form>
      </div>
    </div >
  )
}

export default Sidebar
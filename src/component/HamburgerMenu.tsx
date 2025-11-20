'use client'
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const HamburgerMenu = ({ sidebar, userProfile }: { sidebar: React.ReactNode, userProfile: { name: string, role: string, avatar: string } }) => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const pathname = usePathname();
  useEffect(() => {
    setOpenSidebar(false)
  }, [pathname])

  return (
    <div>
      <button
        className="bg-blue-100 w-8 h-8 relative flex items-center justify-center rounded-full cursor-pointer md:hidden"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        <Image src={"/icon/hamburgerMenu.svg"} alt="notification-icon" width={21} height={21} />
      </button>
      {
        openSidebar && (
          <div className="absolute z-20 w-48 right-6 mt-4 py-2 px-4 rounded-lg shadow-xl shadow-black/20 bg-neutral-50 md:hidden">
            <div className="flex flex-col items-start justify-start mb-2 gap-2 w-full">
              <div className="flex flex-row items-center justify-start w-full mt-2 gap-2 ">
                <Image src={userProfile.avatar !== '/avatar.png' ? `/api/avatar?file=${userProfile.avatar}` : '/avatar.png'} width={40} height={40} alt={"avatar"} className="rounded-full object-cover w-10 h-10" />
                <div className="flex flex-col items-start justify-start text-wrap w-28">
                  <p className="text-xs leading-3 font-semibold truncate text-ellipsis w-full">{userProfile.name}</p>
                  <span className="text-[10px] text-gray-500">{userProfile.role}</span>
                </div>
              </div>
              {sidebar}
            </div>
          </div>
        )
      }
    </div >


  )
}

export default HamburgerMenu;
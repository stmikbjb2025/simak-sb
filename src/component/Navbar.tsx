import Image from "next/image";
import HamburgerMenu from "./HamburgerMenu";
import SidebarContainer from "./SidebarContainer";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { lecturerName } from "@/lib/utils";

const Navbar = async () => {
  const sidebarContainerWrapper = await SidebarContainer();
  const getSessionFunc = await getSession();
  if (!getSessionFunc) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: { id: getSessionFunc?.userId },
    include: {
      operator: true,
      lecturer: true,
      student: true,
      role: true,
    },
  })

  const userLecturerName = await lecturerName({
    frontTitle: user?.lecturer?.frontTitle,
    name: user?.lecturer?.name,
    backTitle: user?.lecturer?.backTitle,
  })

  const userProfile = {
    name: (user?.operator?.name || user?.student?.name || `${userLecturerName}`) || "User",
    role: user?.role?.name || "User",
    avatar: user?.student?.photo || user?.lecturer?.photo || "/avatar.png",
  }

  return (
    <div className="flex items-center justify-between p-4">
      <Link
        href={"/"}
        className="flex md:hidden items-center justify-center gap-2 mx-4"
      >
        <Image src={"/logo.png"} width={32} height={32} alt={"logo"} />
        <span className="text-sm font-semibold">STIMIK BANJARBARU</span>
      </Link>

      {/* ICON AND USER */}
      <div className="flex items-center gap-6 w-full justify-end">
        <div className="md:hidden">
          <HamburgerMenu sidebar={sidebarContainerWrapper} userProfile={userProfile} />
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col lg:w-fit">
            <span className="text-xs leading-3 font-medium text-right">{userProfile.name}</span>
            <span className="text-[10px] text-gray-500 text-right">{userProfile.role}</span>
          </div>
          <div>
            <Image src={userProfile.avatar !== '/avatar.png' ? `/api/avatar?file=${userProfile.avatar}` : '/avatar.png'} alt="profile-icon" width={36} height={36} className="rounded-full object-cover w-10 h-10" />
          </div>
        </div>
      </div>
    </div>
  )
};

export default Navbar;
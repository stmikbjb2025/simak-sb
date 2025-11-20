import Navbar from "@/component/Navbar";
import SidebarContainer from "@/component/SidebarContainer";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen max-h-fit flex overflow-scroll">
      {/* LEFT */}
      <div className="w-0 md:w-[10%] lg:w-[16%] xl:w-[14%] md:p-4 ">
        <Link
          href={"/"}
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src={"/logo.png"} width={32} height={32} alt={"logo"} />
          <span className="hidden lg:block">STIMIK</span>
        </Link>
        <SidebarContainer />
      </div>
      {/* RIGHT */}
      <div className="bg-[#f3f5fa] w-[100%] md:w-[90%] lg:w-[84%] xl:w-[86%] overflow-hidden flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
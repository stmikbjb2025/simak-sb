import { prisma } from "@/lib/prisma";
import Image from "next/image";

interface UserCardProptypes {
  type: "mahasiswa" | "dosen" | "staff",
};

const UserCard = async ({ type }: UserCardProptypes) => {
  const queryByType: Record<typeof type, any> = {
    mahasiswa: prisma.student,
    dosen: prisma.lecturer,
    staff: prisma.operator,
  };

  const data = await queryByType[type].count();
  return (
    <div className="p-4 odd:bg-primary even:bg-secondary rounded-2xl flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-green-600 bg-white px-2 py-1 rounded-full">2024/25</span>
        <Image src={"/more.png"} alt="more-icon" width={20} height={20} className="" />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h2 className="text-sm capitalize font-medium text-gray-500">{type}</h2>
    </div>
  )
}

export default UserCard;
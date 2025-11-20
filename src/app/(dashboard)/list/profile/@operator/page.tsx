import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import Image from "next/image";

const OperatorProfilePage = async () => {
  const session = await getSession();
  const data = await prisma.operator.findUnique({
    where: {
      userId: session?.userId,
    },
    include: {
      user: true,
    }
  });

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-4">
        <div className="bg-white p-4 md:p-8 rounded-xl mt-0 flex flex-col items-center justify-center gap-4">
          <Image
            src={"/avatar.png"}
            alt="profile-img"
            height={144}
            width={144}
            className="w-36 h-36 rounded-full object-cover"
          />
          <div>
            <h1 className="text-base font-semibold text-center capitalize">{data?.name ?? "Nama Lengkap"}</h1>
            <p className="text-sm text-gray-500 font-semibold text-center capitalize">{data?.department || "Departement"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OperatorProfilePage;
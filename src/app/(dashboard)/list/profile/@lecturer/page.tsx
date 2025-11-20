import FormContainer from "@/component/FormContainer";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import Image from "next/image";

const LecturerProfilePage = async () => {
  const session = await getSession();
  const data = await prisma.lecturer.findUnique({
    where: {
      userId: session?.userId,
    },
    include: {
      major: true,
      user: {
        include: {
          role: true,
        }
      }
    }
  })

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full lg:w-1/4 flex flex-col gap-4">
        <div className="bg-white p-4 md:p-8 rounded-xl mt-0 flex flex-col items-center justify-center gap-4">
          <Image
            src={data?.photo ? `/api/avatar?file=${data?.photo}` : '/avatar.png'}
            alt="profile-img"
            height={144}
            width={144}
            className="w-36 h-36 rounded-full object-cover"
          />
          <div>
            <h1 className="text-base font-semibold text-center capitalize">{data?.name ?? "Nama Lengkap"}</h1>
            <p className="text-sm text-gray-500 font-semibold text-center capitalize">{data?.user?.role?.name || "*Dosen"}</p>
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-3/4 flex flex-col">
        <div className="bg-white p-4 rounded-xl mt-0 gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Bio & Detail</h1>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-4 self-end">
                <FormContainer table="lecturer" type="revision" data={data} />
              </div>
            </div>
          </div>

          <span className="block text-xs text-green-600 font-medium mt-8 mb-4">
            Informasi Akademik
          </span>
          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex flex-col gap-2 w-full lg:w-5/11">
              <label className={"text-xs text-gray-800"}>{"NPK"}</label>
              <input
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-lg text-sm w-full disabled:text-gray-800 disabled:bg-gray-200"
                value={data?.npk ?? "-"}
                disabled
              />
            </div>
            <div className="flex flex-col gap-2 w-full lg:w-5/11">
              <label className={"text-xs text-gray-800"}>{"NIDN"}</label>
              <input
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-lg text-sm w-full disabled:text-gray-800 disabled:bg-gray-200"
                value={data?.nidn ?? "-"}
                disabled
              />
            </div>
            <div className="flex flex-col gap-2 w-full lg:w-5/11">
              <label className={"text-xs text-gray-800"}>{"NUPTK"}</label>
              <input
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-lg text-sm w-full disabled:text-gray-800 disabled:bg-gray-200"
                value={data?.nuptk ?? "-"}
                disabled
              />
            </div>
            <div className="flex flex-col gap-2 w-full lg:w-5/11">
              <label className={"text-xs text-gray-800"}>{"Program Studi"}</label>
              <input
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-lg text-sm w-full disabled:text-gray-800 disabled:bg-gray-200"
                value={data?.major?.name ?? "-"}
                disabled
              />
            </div>
            <div className="flex flex-col gap-2 w-full lg:w-5/11">
              <label className={"text-xs text-gray-800"}>{"Pendidikan Terakhir"}</label>
              <input
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-lg text-sm w-full disabled:text-gray-800 disabled:bg-gray-200"
                value={data?.degree ?? "-"}
                disabled
              />
            </div>
            <div className="flex flex-col gap-2 w-full lg:w-5/11">
              <label className={"text-xs text-gray-800"}>{"Tahun Masuk"}</label>
              <input
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-lg text-sm w-full disabled:text-gray-800 disabled:bg-gray-200"
                value={data?.year ?? "-"}
                disabled
              />
            </div>
          </div>

          <span className=" block text-xs text-green-600 font-medium mt-8 mb-4">
            Informasi Personal
          </span>
          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex flex-col gap-2 w-full lg:w-5/11">
              <label className={"text-xs text-gray-800"}>{"Jenis Kelamin"}</label>
              <input
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-lg text-sm w-full disabled:text-gray-800 disabled:bg-gray-200"
                disabled
                value={data?.gender ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2 w-full lg:w-5/11">
              <label className={"text-xs text-gray-800"}>{"Agama"}</label>
              <input
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-lg text-sm w-full disabled:text-gray-800 disabled:bg-gray-200"
                disabled
                value={data?.religion ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2 w-full lg:w-5/11">
              <label className={"text-xs text-gray-800"}>{"Email Pribadi"}</label>
              <input
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-lg text-sm w-full disabled:text-gray-800 disabled:bg-gray-200"
                disabled
                value={data?.email ?? "user@email.com"}
              />
            </div>
            <div className="flex flex-col gap-2 w-full lg:w-5/11">
              <label className={"text-xs text-gray-800"}>{"No. HP"}</label>
              <input
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-lg text-sm w-full disabled:text-gray-800 disabled:bg-gray-200"
                disabled
                value={data?.hp ?? "-"}
              />
            </div>
            <div className="flex flex-col gap-2 w-full lg:w-5/11">
              <label className={"text-xs text-gray-800"}>{"Alamat Lengkap"}</label>
              <textarea
                className="ring-[1.5px] ring-gray-300 p-2 rounded-lg text-sm w-full disabled:text-gray-800 disabled:bg-gray-200"
                disabled
                rows={4}
                value={data?.address ?? "-"}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LecturerProfilePage;
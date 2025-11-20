import Announcements from "@/component/Announcements";
import BigCalendarContainer from "@/component/BigCalendarContainer";
import { prisma } from "@/lib/prisma";
import { lecturerName } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const SingleLecturerPage = async (
  { params }: { params: Promise<{ id: string }> },
) => {

  const { id } = await params;
  const period = await prisma.period.findFirst({
    where: {
      isActive: true,
    }
  })
  const data = await prisma.lecturer.findUnique({
    where: {
      id: id
    },
    include: {
      user: true,
      major: true,
    }
  });
  const classCount = await prisma.academicClass.count({
    where: {
      periodId: period?.id,
      lecturerId: id,
    }
  });
  const courseCount = await prisma.academicClass.findMany({
    where: {
      periodId: period?.id,
      lecturerId: id,
    },
    select: {
      courseId: true,
    },
    distinct: ["courseId"],
  });

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-3/4">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-primary py-6 px-4 rounded-md flex-2 flex flex-col md:flex-row gap-4">
            <div className="w-full items-center justify-center flex md:w-1/3">
              <Image
                src={data.photo ? `/api/avatar?file=${data.photo}` : '/avatar.png'}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-full md:w-2/3 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-4">
                <h1 className="text-lg font-semibold">
                  {lecturerName({
                    frontTitle: data?.frontTitle,
                    name: data?.name,
                    backTitle: data?.backTitle,
                  })}
                </h1>
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{data?.user?.email || 'email@example.com'}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <div className="w-4 h-4">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 6H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V6H5C3.3 6 2 7.3 2 9V18C2 19.7 3.3 21 5 21H19C20.7 21 22 19.7 22 18V9C22 7.3 20.7 6 19 6ZM10 5H14V6H10V5ZM20 18C20 18.6 19.6 19 19 19H5C4.4 19 4 18.6 4 18V12.4L8.7 14C8.8 14 8.9 14 9 14H15C15.1 14 15.2 14 15.3 13.9L20 12.3V18Z" fill="black" />
                    </svg>
                  </div>
                  <span>{data?.major?.name}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{data?.year}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{data?.hp || '+1 234 xxx'}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-start flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-full">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{courseCount.length}</h1>
                <span className="text-sm text-gray-400">Mata Kuliah</span>
              </div>
            </div>
            {/* CARD */}
            {/* <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-[45%] 2xl:w-[48%]"> */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] lg:w-full">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{classCount}</h1>
                <span className="text-sm text-gray-400">Kelas</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 min-h-fit">
          <h1>Jadwal Dosen</h1>
          <BigCalendarContainer type="lecturerId" id={id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-green-50" href={`/list/classes?lecturerId=${id}`}>
              Kelas Dosen
            </Link>
            <Link className="p-3 rounded-md bg-orange-50" href={`/list/students?lecturerId=${id}`}>
              Perwalian Mahasiswa
            </Link>
          </div>
        </div>
        {/* <Performance /> */}
        <Announcements />
      </div>
    </div>
  );
};

export default SingleLecturerPage;
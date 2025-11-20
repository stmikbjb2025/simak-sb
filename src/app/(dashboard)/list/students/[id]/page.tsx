import Announcements from "@/component/Announcements";
import BigCalendarContainer from "@/component/BigCalendarContainer";
import FormContainer from "@/component/FormContainer";
import { prisma } from "@/lib/prisma";
import { lecturerName } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleStudentPage = async (
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const data = await prisma.student.findUnique({
    where: {
      id: id,
    },
    include: {
      user: true,
      major: true,
      lecturer: true,
    },
  });
  const coursesCompleted = await prisma.khsDetail.findMany({
    where: {
      khs: {
        studentId: id,
        isRPL: false,
      },
      isLatest: true,
    },
    include: {
      course: {
        select: { code: true, name: true }
      },
    },
    take: 5,
    distinct: ["courseId"],
  });

  const courseRPL = await prisma.khsDetail.findMany({
    where: {
      khs: {
        studentId: id,
        isRPL: true,
      },
      isLatest: true,
    },
    select: {
      course: {
        select: { code: true, name: true }
      },
    },
    take: 5,
  })
  const dataRpl = await prisma.khs.findFirst({
    where: {
      studentId: id,
      isRPL: true,
    },
    select: {
      id: true,
      student: {
        select: {
          id: true,
          name: true,
          nim: true,
          major: {
            select: {
              name: true,
            },
          },
        },
      },
      period: {
        select: {
          id: true,
          name: true,
        },
      },
      khsDetail: {
        select: {
          courseId: true,
          gradeLetter: true,
          weight: true,
        }
      },
    }
  });
  dataRpl?.khsDetail.forEach((element: any) => {
    element.id = element.courseId;
    element.gradeLetter = element.gradeLetter;
    element.weight = parseFloat(element.weight);
  });

  if (!data) {
    notFound()
  }
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-primary py-6 px-4 rounded-md flex-2 flex flex-col md:flex-row gap-4">
            <div className="w-full items-center justify-center flex md:w-1/3">
              <Image
                src="/avatar.png"
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-full md:w-2/3 flex flex-col  gap-4">
              <h1 className="text-lg font-semibold">{data?.name}</h1>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{data?.user?.email ?? 'username@user.com'}</span>
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
                  <div className="w-4 h-4">
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.6 6.9C6.6 7 6.7 7.1 6.8 7.2L8.8 9.2C9 9.4 9.2 9.5 9.5 9.5C9.8 9.5 10 9.4 10.2 9.2C10.6 8.8 10.6 8.2 10.2 7.8L9.9 7.5H14.1L13.8 7.8C13.6 8 13.5 8.2 13.5 8.5C13.5 9.1 13.9 9.5 14.5 9.5C14.8 9.5 15 9.4 15.2 9.2L17.2 7.2C17.3 7.1 17.4 7 17.4 6.9C17.4 6.8 17.5 6.7 17.5 6.5C17.5 6.4 17.5 6.2 17.4 6.1C17.3 6 17.3 5.9 17.2 5.8L15.2 3.8C14.8 3.4 14.2 3.4 13.8 3.8C13.4 4.2 13.4 4.8 13.8 5.2L14.1 5.5H9.9L10.2 5.2C10.6 4.8 10.6 4.2 10.2 3.8C9.8 3.4 9.2 3.4 8.8 3.8L6.8 5.8C6.7 5.9 6.6 6 6.6 6.1C6.6 6.2 6.5 6.3 6.5 6.5C6.5 6.6 6.5 6.8 6.6 6.9ZM6 14.7C7.4 14.7 8.6 13.5 8.6 12.1C8.6 10.7 7.4 9.5 6 9.5C4.6 9.5 3.4 10.7 3.4 12.1C3.4 13.5 4.6 14.7 6 14.7ZM9.8 17.4C7.2 15.3 3.4 15.7 1.3 18.3C1.1 18.6 1 18.9 1 19.2C1 19.9 1.6 20.5 2.3 20.5H9.7C10.2 20.5 10.7 20.2 10.9 19.8C11.1 19.4 11.1 18.8 10.7 18.4C10.4 18 10.1 17.7 9.8 17.4ZM15.4 12.1C15.4 13.5 16.6 14.7 18 14.7C19.4 14.7 20.6 13.5 20.6 12.1C20.6 10.7 19.4 9.5 18 9.5C16.6 9.5 15.4 10.7 15.4 12.1ZM22.7 18.4C22.4 18.1 22.1 17.7 21.8 17.5C19.2 15.4 15.4 15.8 13.3 18.4C13.1 18.6 13 18.9 13 19.2C13 19.9 13.6 20.5 14.3 20.5H21.7C22.2 20.5 22.7 20.2 22.9 19.8C23.1 19.3 23 18.8 22.7 18.4Z" fill="black" />
                    </svg>
                  </div>
                  <span>
                    {lecturerName({
                      frontTitle: data?.lecturer?.frontTitle,
                      name: data?.lecturer?.name,
                      backTitle: data?.lecturer?.backTitle,
                    }) ?? "-"}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{data?.year}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{data.hp ?? "+1 234 567"}</span>
                </div>

              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 min-h-fit">
          <h1>Jadwal Mahasiswa</h1>
          <BigCalendarContainer type="studentId" id={id} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md flex gap-2 w-full md:w-[48%] lg:w-full ">
          <Image
            src="/Transcript.png"
            alt=""
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <div className="">
            <h1 className="text-base font-semibold">{data?.statusRegister}</h1>
            <span className="text-sm text-gray-400">Status Register</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-green-50" href={`/list/krs?studentId=${id}`}>
              Rencana Studi
            </Link>
            <Link className="p-3 rounded-md bg-orange-50" href={`/list/khs?studentId=${id}`}>
              Hasil Studi
            </Link>
            <Link className="p-3 rounded-md bg-fuchsia-100" href={`/list/transcripts?studentId=${id}`}>
              Transkip
            </Link>
          </div>
        </div>
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-lg font-semibold">Mata Kuliah yang Telah Diambil</h1>
          <div className="flex flex-row items-center gap-4 w-full md:w-auto justify-start ">
            <ul className="flex flex-col  mt-4">
              {coursesCompleted && coursesCompleted.map((items: any) => (
                <li className="p-4 text-sm border-b border-gray-200" key={items.course.code}>
                  <span className="block text-xs font-semibold mb-1">{items.course.code}</span>
                  {items.course.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {data?.statusRegister !== "BARU" && (
          <div className="bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">Mata Kuliah RPL</h1>

            <div className="flex flex-row items-center gap-4 w-full md:w-auto justify-start xl:justify-end">
              <div className="flex items-center gap-4 self-end">
                {dataRpl ? (<FormContainer table="rpl" type="update" data={dataRpl} />) : (<FormContainer table="rpl" type="create" data={data} />)}
              </div>
            </div>
            <div className="flex flex-row items-center gap-4 w-full md:w-auto justify-start ">
              <ul className="flex flex-col  mt-4">
                {courseRPL && courseRPL.map((items: any) => (
                  <li className="p-4 text-sm border-b border-gray-200" key={items.course.code}>
                    {items.course.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {/* <Performance /> */}
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;

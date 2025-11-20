import TabNavigation from "@/component/TabNavigationCourse";
import { prisma } from "@/lib/prisma";
import { lecturerName } from "@/lib/utils";

const ClassDetailLayout = async (
  {
    tab,
    params
  }: {
    tab: React.ReactNode,
    params: Promise<{ id: string }>
  }
) => {

  const { id } = await params;
  const [dataAcademicClass] = await prisma.$transaction([
    prisma.academicClass.findFirst({
      where: {
        id: id,
      },
      include: {
        lecturer: true,
        course: true,
        period: true,
        scheduleDetail: true,
      }
    }),
  ]);

  const tabs = [
    { href: `/list/classes/${id}/student`, label: "Peserta" },
    { href: `/list/classes/${id}/syllabus`, label: "Perkuliahan" },
    { href: `/list/classes/${id}/presence`, label: "Presensi" },
    { href: `/list/classes/${id}/assessment`, label: "Penilaian" },
    { href: `/list/classes/${id}/revision`, label: "Revisi" },
  ];

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      {/* TOP */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* USER INFO CARD */}
        <div className="bg-primary py-6 px-8 rounded-md flex-1 flex gap-4 w-full lg:w-3/4">
          <div className="w-full flex flex-col justify-between gap-4">
            <header>
              <h1 className="text-xl font-semibold">{dataAcademicClass?.course?.name || ""} </h1>
              <div className="h-0.5 w-full bg-gray-300" />
              <p className="text-sm text-slate-600 font-medium mt-1">
                {dataAcademicClass?.course?.code} | Kelas {dataAcademicClass.name}
              </p>
            </header>
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
              <div className="w-full 2xl:w-1/3 gap-2 flex justify-start">
                <span className="w-3/10">Dosen Pengampu</span>
                <span>:</span>
                <span className="w-6/10">
                  {lecturerName(
                    {
                      frontTitle: dataAcademicClass?.lecturer?.frontTitle,
                      name: dataAcademicClass?.lecturer?.name,
                      backTitle: dataAcademicClass.lecturer.backTitle
                    }
                  )}
                </span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="w-3/10">Thn. Akad</span>
                <span >:</span>
                <span className="w-6/10 self-start">{dataAcademicClass?.period?.name}</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="w-3/10">Semester</span>
                <span>:</span>
                <span className="w-6/10 self-start">{dataAcademicClass?.semester || 0}</span>
              </div>
              {/* <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="w-3/10">Jadwal</span>
                <span>:</span>
                <span className="w-6/10 self-start">Rabu, 09:40 - 11:20</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      <div className="bg-white rounded-md flex-1 mt-0">
        <div className="w-full">
          <TabNavigation tabs={tabs} />
        </div>
        {tab}
      </div>
    </div>
  )
}

export default ClassDetailLayout;
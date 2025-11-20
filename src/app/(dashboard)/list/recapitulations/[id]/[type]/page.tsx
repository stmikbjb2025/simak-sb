import ButtonPdfDownload from "@/component/ButtonPdfDownload";
import FilterSearch from "@/component/FilterSearch";
import CourseKrs from "@/component/recapType/CourseKrs";
import StudentActiveInactive from "@/component/recapType/StudentActiveInactive";
import StudentsRegisteredKrs from "@/component/recapType/StudentsRegisteredKrs";
import StudentsRegularSore from "@/component/recapType/StudentsRegularSore";
import StudentsTakingInternship from "@/component/recapType/StudentsTakingInternship";
import StudentsTakingThesis from "@/component/recapType/StudentsTakingThesis";
import StudentsUnregisteredKrs from "@/component/recapType/StudentsUnregisteredKrs";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { RecapitulationCardType } from "@/lib/types/recaptype";

const RecapitulationDetailByCardPage = async (
  {
    searchParams, params
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>,
    params: Promise<{ id: string, type: RecapitulationCardType }>,
  }
) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const { id, type } = await params;
  ;
  const headingText: {
    [key: string]: string
  } = {
    coursekrs: "Daftar Mata Kuliah yang Diambil",
    studentsRegisteredKrs: "Daftar Mahasiswa yang Sudah KRS",
    studentsUnregisteredKrs: "Daftar Mahasiswa yang Belum KRS",
    studentsTakingThesis: "Daftar Mahasiswa Program TA",
    studentsTakingInternship: "Daftar Mahasiswa Program PKL",
    studentActiveInactive: "Daftar Mahasiswa Aktif/non-aktif",
    studentsRegularSore: "Daftar Mahasiswa Reg.Pagi/Sore",
  };

  const tableComponent: {
    [key: string]: React.ReactNode;
  } = {
    coursekrs: <CourseKrs periodId={id} page={p} queryParams={queryParams} />,
    studentsRegisteredKrs: <StudentsRegisteredKrs periodId={id} page={p} queryParams={queryParams} />,
    studentsUnregisteredKrs: <StudentsUnregisteredKrs periodId={id} page={p} queryParams={queryParams} />,
    studentsTakingThesis: <StudentsTakingThesis periodId={id} page={p} queryParams={queryParams} />,
    studentsTakingInternship: <StudentsTakingInternship periodId={id} page={p} queryParams={queryParams} />,
    studentActiveInactive: <StudentActiveInactive periodId={id} page={p} queryParams={queryParams} />,
    studentsRegularSore: <StudentsRegularSore periodId={id} page={p} queryParams={queryParams} />,
  }

  const dataFilter = await prisma.major.findMany({ select: { id: true, name: true, } });
  dataFilter.unshift({ id: "all", name: "semua" })

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">{`${headingText[type]}`}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-start xl:justify-between">
        <FilterSearch data={dataFilter} />
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            <a
              href={`/api/excel?u=${id}&type=${type}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium w-fit py-2 px-4 text-gray-900 bg-primary/70 rounded-full cursor-pointer hover:bg-primary"
            >
              Export .xlsx
            </a>
            <ButtonPdfDownload id={id} type={type}>
              <div className={`w-fit h-fit py-2 px-4 text-xs text-gray-900 font-medium flex items-center justify-center rounded-full bg-primary`}>
                Export .pdf
              </div>
            </ButtonPdfDownload>
          </div>
        </div>
      </div>
      {/* LIST */}
      {tableComponent[type]}
    </div>
  )
}

export default RecapitulationDetailByCardPage;
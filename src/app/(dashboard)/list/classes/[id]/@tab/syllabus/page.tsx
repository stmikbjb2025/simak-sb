
import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { PresenceTypes } from "@/lib/types/datatypes/type";

const ClassSingleTabStudentPage = async (
  {
    searchParams, params
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>,
    params: Promise<{ id: string }>
  }
) => {

  const { page } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const { id } = await params;

  const role = await getSession();

  const [dataAcademicClass, data, count] = await prisma.$transaction([
    prisma.academicClass.findFirst({
      where: {
        id: id,
      },
      include: {
        course: true,
      }
    }),
    prisma.presence.findMany({
      where: {
        academicClassId: id,
      },
      orderBy: [
        { weekNumber: 'asc' },
      ],
    }),
    prisma.presence.count({
      where: {
        academicClassId: id,
      },
    }),
  ]);

  let dataPassToForm;
  dataPassToForm = {
    id: "",
    academicClassId: id,
    academicClass: dataAcademicClass,
    weekNumber: count + 1,
    date: new Date(),
    duration: "",
    learningMethod: [],
    lesson: "",
    lessonDetail: "",
  }

  const columns = [
    {
      header: "Info",
      accessor: "Info",
      className: "px-2 lg:hidden"
    },
    {
      header: "No.",
      accessor: "no.",
      className: "hidden lg:table-cell md:px-2"
    },
    {
      header: "Tanggal",
      accessor: "Tanggal",
      className: "hidden lg:table-cell",
    },
    {
      header: "Pokok Bahasan",
      accessor: "pokok bahasan",
      className: "hidden lg:table-cell",
    },
    {
      header: "Metode",
      accessor: "metode",
      className: "hidden lg:table-cell",
    },
    {
      header: "Waktu",
      accessor: "waktu",
      className: "hidden lg:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden lg:table-cell",
    },
  ];

  const renderRow = (item: PresenceTypes) => {
    dataPassToForm = {
      id: item.id,
      academicClassId: id,
      academicClass: dataAcademicClass,
      weekNumber: item.weekNumber,
      date: item.date,
      duration: item.duration,
      lesson: item.lesson,
      lessonDetail: item.lessonDetail,
      learningMethod: item?.learningMethod === null ? [] : item?.learningMethod.split(","),
      isActive: item.isActive,
      presenceDuration: item.presenceDuration,
    }

    return (
      <tr
        key={item.id}
        className="border-b border-gray-300 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 lg:hidden py-4 px-2">
          <div className="flex flex-col col-span-5 items-start">
            <p className="text-xs text-gray-600 mb-2">{item.weekNumber} | {new Intl.DateTimeFormat("id-ID").format(item.date)}</p>
            <h3 className="text-sm font-semibold tracking-wide">{item.lesson}</h3>
            <p className="text-sm font-light mb-2 tracking-wide">{item.lessonDetail}</p>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <ModalAction>
              <div className="flex items-center gap-3">
                <FormContainer table="presence" type="update" data={dataPassToForm} />
                {role?.roleType === 'OPERATOR' && (<FormContainer table="presence" type="delete" id={item.id} />)}
                <FormContainer table="presenceDetail" type={item.isActive ? "presenceActive" : "presenceNon"} data={dataPassToForm} />
              </div>
            </ModalAction>
          </div>
        </td>
        <td className="hidden lg:table-cell lg:px-2 lg:py-4">{item.weekNumber}</td>
        <td className="hidden lg:table-cell">{new Intl.DateTimeFormat("id-ID").format(item.date)}</td>
        <td className="hidden lg:flex lg:flex-col lg:py-4 lg:w-[376px]">
          <h5 className="text-sm font-semibold">Pokok bahasan :</h5>
          <p className="text-sm font-light mb-2 tracking-wide">{item.lesson}</p>
          <h5 className="text-sm font-semibold">Sub pokok bahasan :</h5>
          <p className="text-sm font-light mb-2 tracking-wide">{item.lessonDetail}</p>
        </td>
        <td className="hidden lg:table-cell">
          <ul className="list-disc list-inside">
            {dataPassToForm.learningMethod.map((item: string) => (
              <li key={item} className="text-xs font-light">{item}</li>
            ))}
          </ul>
        </td>
        <td className="hidden lg:table-cell text-sm font-light">
          {item.presenceDuration}
        </td>
        <td>
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2">
              <FormContainer table="presence" type="update" data={dataPassToForm} />
              {role?.roleType === 'OPERATOR' && (<FormContainer table="presence" type="delete" id={item.id} />)}
              <FormContainer table="presenceDetail" type={item.isActive ? "presenceActive" : "presenceNon"} data={dataPassToForm} />
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:mb-6">
        <h1 className="text-base font-semibold">Data Perkuliahan</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* <TableSearch /> */}
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="presence" type="create" data={dataPassToForm} />
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count || 0} />
    </div>
  )
}

export default ClassSingleTabStudentPage;
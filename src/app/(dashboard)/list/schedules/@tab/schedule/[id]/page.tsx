import FilterSearch from "@/component/FilterSearch";
import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { Day, Prisma } from "@/generated/prisma/client";
import { ScheduleDetailTypes } from "@/lib/types/datatypes/type";

const ScheduleDetailPage = async (
  {
    searchParams, params
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>,
    params: Promise<{ id: string }>
  }
) => {

  const { ...queryParams } = await searchParams;
  const { id } = await params;

  const query: Prisma.ScheduleDetailWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "filter":
            query.OR = [
              { dayName: { equals: value as Day } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [dataSchedule, dataDetail] = await prisma.$transaction([
    prisma.schedule.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        periodId: true
      },
    }),
    prisma.scheduleDetail.findMany({
      where: {
        scheduleId: id,
        ...query,
      },
      include: {
        time: true,
        academicClass: {
          include: {
            lecturer: true,
            room: true,
            course: {
              include: {
                major: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          time: {
            timeStart: "asc"
          }
        },
        {
          academicClass: {
            name: "asc"
          }
        }
      ]
    }),
  ]);

  const dataFilter = [
    { id: "SENIN", name: "SENIN" },
    { id: "SELASA", name: "SELASA" },
    { id: "RABU", name: "RABU" },
    { id: "KAMIS", name: "KAMIS" },
    { id: "JUMAT", name: "JUMAT" },
    { id: "SABTU", name: "SABTU" },
    { id: "MINGGU", name: "MINGGU" },
  ];
  const columns = [
    {
      header: "Hari",
      accessor: "hari",
      className: "hidden md:table-cell md:px-4"
    },
    {
      header: "Jam",
      accessor: "jam",
      className: "hidden md:table-cell"
    },
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-0",
    },
    {
      header: "Kelas",
      accessor: "kelas",
      className: "hidden md:table-cell",
    },
    {
      header: "Ruang",
      accessor: "ruang",
      className: "hidden md:table-cell",
    },
    {
      header: "Dosen Pengampu",
      accessor: "dosen pengampu",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: ScheduleDetailTypes) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
    >
      <td className="hidden md:table-cell px-4">
        {item.dayName}
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("id-ID", { hour: "numeric", minute: "numeric" }).format(item.time.timeStart || Date.now())} - {new Intl.DateTimeFormat("id-ID", { hour: "numeric", minute: "numeric" }).format(item.time.timeFinish || Date.now())}
      </td>
      <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-0">
        <div className="flex flex-col col-span-5 items-start">
          <p className="flex text-xs text-gray-500">{item.academicClass.course.code}</p>
          <h3 className="font-semibold md:font-normal">{item.academicClass.course.name}</h3>
        </div>
        <div className="flex items-center justify-end gap-2 md:hidden ">
          <ModalAction>
            <div className="flex items-center gap-3">
              <FormContainer table="scheduleDetail" type="delete" id={item.id} />
            </div>
          </ModalAction>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.academicClass.name}</td>
      <td className="hidden md:table-cell">{item.academicClass.room.name}</td>
      <td className="hidden md:table-cell">{item.academicClass.lecturer.name}</td>
      <td>
        <div className="hidden md:flex items-center gap-2">
          <FormContainer table="scheduleDetail" type="delete" id={item.id} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">{dataSchedule.name}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="scheduleDetail" type="create" data={dataSchedule} />
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        <FilterSearch data={dataFilter} />
      </div>
      <Table columns={columns} renderRow={renderRow} data={dataDetail} />
    </div>
  )
}

export default ScheduleDetailPage;
import FilterSearch from "@/component/FilterSearch";
import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { Day, Prisma } from "@/generated/prisma/client";
import { ScheduleDetailTypes } from "@/lib/types/datatypes/type";
import Tooltip from "@/component/Tooltip";

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
        room: true,
        academicClass: {
          include: {
            lecturer: true,
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
            course: {
              name: "asc"
            }
          }
        }
      ]
    }),
  ]);


  // Data duplicate by dayName|timeId|roomId
  // Record<string, ScheduleDetailTypes[]>
  const grouped: { [key: string]: string[] } | {} = dataDetail.reduce((acc: { [key: string]: string[] }, item: ScheduleDetailTypes) => {
    const key = `${item.dayName}|${item.time.id}|${item.room.id}`;
    acc[key] = (acc[key] || []).concat(item.id);
    return acc;
  }, {})

  const duplicates = Object.values(grouped).flatMap((items: string[]) => {
    return items.length > 1 ? items : [];
  });

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
      className: "hidden lg:table-cell md:px-4"
    },
    {
      header: "Jam",
      accessor: "jam",
      className: "hidden lg:table-cell"
    },
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-0",
    },
    {
      header: "Ruang",
      accessor: "ruang",
      className: "hidden lg:table-cell",
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
      <td className="hidden lg:table-cell px-4">
        {item.dayName}
      </td>
      <td className="hidden lg:table-cell">
        {new Intl.DateTimeFormat("id-ID", { hour: "numeric", minute: "numeric" }).format(item.time.timeStart || Date.now())} - {new Intl.DateTimeFormat("id-ID", { hour: "numeric", minute: "numeric" }).format(item.time.timeFinish || Date.now())}
      </td>
      <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-0">
        <div className="flex flex-col col-span-5 items-start">
          <div className="flex text-xs gap-1">
            <p className="font-medium">Kelas: <span>{item.academicClass.name}</span></p> | <p className="text-gray-500">{item.academicClass.course.code}</p>
            {duplicates.includes(item.id) && (
              <Tooltip
                content={
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-yellow-400">Jadwal bentrok!</span>
                    <span className="text-xs  ">Abaikan jika sudah benar.</span>
                  </div>
                }
              >
                <div className="bg-yellow-300 items-center rounded-full hover:cursor-pointer z-30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12V16C11 16.2652 11.1054 16.5196 11.2929 16.7071C11.4804 16.8946 11.7348 17 12 17C12.2652 17 12.5196 16.8946 12.7071 16.7071C12.8946 16.5196 13 16.2652 13 16V12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11ZM12.38 7.08C12.1365 6.97998 11.8635 6.97998 11.62 7.08C11.4973 7.12759 11.3851 7.19896 11.29 7.29C11.2017 7.3872 11.1306 7.49882 11.08 7.62C11.024 7.73868 10.9966 7.86882 11 8C10.9992 8.13161 11.0245 8.26207 11.0742 8.38391C11.124 8.50574 11.1973 8.61656 11.29 8.71C11.3872 8.79833 11.4988 8.86936 11.62 8.92C11.7715 8.98224 11.936 9.00632 12.099 8.99011C12.2619 8.97391 12.4184 8.91792 12.5547 8.82707C12.691 8.73622 12.8029 8.61328 12.8805 8.46907C12.9582 8.32486 12.9992 8.16378 13 8C12.9963 7.73523 12.8927 7.48163 12.71 7.29C12.6149 7.19896 12.5028 7.12759 12.38 7.08ZM12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7363 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C10.4178 20 8.87104 19.5308 7.55544 18.6518C6.23985 17.7727 5.21447 16.5233 4.60897 15.0615C4.00347 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00346 15.0615 4.60896C16.5233 5.21447 17.7727 6.23984 18.6518 7.55544C19.5308 8.87103 20 10.4177 20 12C20 14.1217 19.1572 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20Z"
                      fill="black"
                    />
                  </svg>
                </div>
              </Tooltip>
            )}
          </div>
          <h3 className="text-sm font-normal">{item.academicClass.course.name}</h3>
          <h4 className="text-xs mt-2">
            Dosen: <span className="font-bold">{item.academicClass.lecturer.name}</span>
          </h4>
        </div>
        <div className="flex items-center justify-end gap-2 md:hidden ">
          <ModalAction>
            <div className="flex items-center gap-3">
              <FormContainer table="scheduleDetail" type="delete" id={item.id} />
            </div>
          </ModalAction>
        </div>
      </td>
      <td className="hidden lg:table-cell">{item?.room?.name ?? ""}</td>
      <td>
        <div className="hidden md:flex items-center gap-2">
          <FormContainer table="scheduleDetail" type="update" data={item} />
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
          {/* <div className="flex items-center gap-4 self-end">
            <FormContainer table="scheduleDetail" type="create" data={dataSchedule} />
          </div> */}
          <div className="flex items-center gap-4 self-end">
            <a
              href={`/api/excel?u=${id}&type=schedule`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium w-fit py-2 px-4 text-gray-900 bg-primary/70 rounded-full cursor-pointer hover:bg-primary"
            >
              Export .xlsx
            </a>
            <FormContainer table="scheduleDetail" type="create" data={{ scheduleId: dataSchedule.id }} />
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

import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import PresenceStatus from "@/component/PresenceStatus";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Prisma } from "@/generated/prisma/client";
import { AcademicClassDetailTypes, PresenceDetailTypes } from "@/lib/types/datatypes/type";

type PresenceDetailDataType = AcademicClassDetailTypes & { presenceDetail: PresenceDetailTypes[] }

const ClassSingleTabStudentPage = async (
  {
    searchParams, params
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>,
    params: Promise<{ id: string }>
  }
) => {
  const user = await getSession();
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const { id } = await params;

  const query: Prisma.AcademicClassDetailWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { student: { name: { contains: value, mode: "insensitive" } } },
              { student: { nim: { contains: value, mode: "insensitive" } } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [dataStudent, data, dataCreateMany, count] = await prisma.$transaction([
    prisma.academicClassDetail.findMany({
      where: {
        academicClassId: id,
        ...query,
      },
      include: {
        student: true,
      },
      orderBy: [
        { student: { nim: 'asc' } },
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.presenceDetail.findMany({
      where: {
        academicClassDetail: {
          academicClassId: id,
        },
      },
      include: {
        presence: true,
      },
      orderBy: [
        {
          presence: {
            weekNumber: 'asc',
          }
        }
      ]
    }),
    prisma.presence.findMany({
      where: {
        academicClassId: id,
      },
      include: {
        academicClass: {
          include: {
            course: true,
          }
        },
      },
      orderBy: [
        { weekNumber: 'asc' }
      ]
    }),
    prisma.academicClassDetail.count({
      where: {
        academicClassId: id,
        ...query,
      },
    }),
  ]);

  const dataGabungan = dataStudent.map((items: any) => {
    const dataPresence = data.filter((element: any) => element.academicClassDetailId === items.id)
    return (
      {
        ...items,
        presenceDetail: dataPresence
      }
    )
  })

  const columns = [
    {
      header: "Mahasiswa",
      accessor: "mahasiswa",
      className: "px-2 md:px-4"
    },
    {
      header: "Presensi Perkuliahan",
      accessor: "presensi perkuliahan",
      className: "hidden lg:table-cell",
    },
  ];

  const renderRow = (item: PresenceDetailDataType) => {
    return (
      <tr
        key={item.student.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="flex flex-col gap-2 py-4 px-2 md:px-4 lg:w-80">
          <div className="flex flex-col items-start w-full">
            <h3 className="text-sm font-semibold truncate">{item.student.name}</h3>
            <p className="text-xs text-gray-600">{item.student.nim}</p>
          </div>
          <div className="flex items-center justify-start gap-2 lg:hidden ">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {item.presenceDetail.map((presenceItem: any) => (
                <PresenceStatus key={presenceItem.id} data={presenceItem} role={user?.roleType} />
              ))}
            </div>
          </div>
        </td>
        <td className="hidden lg:table-cell py-2">
          <div className="grid lg:grid-cols-10 gap-2">
            {item.presenceDetail.map((presenceItem: any) => (
              <PresenceStatus key={presenceItem.id} data={presenceItem} role={user?.roleType} />
            ))}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:mb-6">
        <h1 className="text-base font-semibold">Daftar Presensi</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="presenceAll" type="createMany" data={dataCreateMany} />
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={dataGabungan} />
      {/* PAGINATION */}
      <Pagination page={p} count={count || 0} />
    </div>
  )
}

export default ClassSingleTabStudentPage;
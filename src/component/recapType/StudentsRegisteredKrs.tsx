import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Table from "../Table";
import Pagination from "../Pagination";
import { lecturerName } from "@/lib/utils";
import { Prisma } from "@/generated/prisma/client";

type recapType = {
  periodId: string,
  page: number,
  queryParams: { [key: string]: string | undefined },
};

const StudentsRegisteredKrs = async (
  { periodId, page, queryParams }: recapType) => {

  const query: Prisma.KrsWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { student: { name: { contains: value, mode: "insensitive" } } },
              { student: { nim: { contains: value, mode: "insensitive" } } },
              { student: { major: { name: { contains: value, mode: "insensitive" } } } },
            ]
            break;
          case "filter":
            query.OR = [
              { student: { major: { id: parseInt(value) } } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count] = await prisma.$transaction(async (tx: any) => {
    const data = await tx.krs.findMany({
      where: {
        reregister: {
          periodId: periodId,
        },
        krsDetail: {
          some: {},
        },
        ...query,
      },
      select: {
        student: {
          select: {
            nim: true,
            name: true,
            major: true,
          }
        },
        ips: true,
        isStatusForm: true,
        reregisterDetail: {
          select: {
            lecturer: {
              select: {
                name: true,
                frontTitle: true,
                backTitle: true,
              }
            },
            semester: true,
          }
        },
        krsDetail: {
          select: {
            course: {
              select: {
                sks: true,
              }
            }
          }
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
      orderBy: [
        { student: { nim: "desc" } }
      ],
    });
    data.forEach((item: any) => {
      item.ips = Number(item.ips).toFixed(2);
      item.totalSks = item.krsDetail.reduce((acc: number, curr: any) => acc + curr.course.sks, 0);
    })

    const count = await tx.krs.count({
      where: {
        reregister: {
          periodId: periodId,
        },
        krsDetail: {
          some: {},
        },
        ...query,
      },
    });
    return [data, count];
  })

  const renderRow = (item: any) => {
    return (
      <tr
        key={item?.student?.nim}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="font-semibold">{item?.student?.name || ""}</h3>
            <p className="text-xs font-medium text-gray-500">{item?.student?.nim || ""}</p>
            <p className="text-xs font-medium text-gray-500">Semester: {item?.reregisterDetail?.semester || ""}</p>
            <div className="flex gap-1 mt-1">

            </div>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
          </div>
        </td>
        <td className="hidden md:table-cell">{item?.student?.major?.stringCode || "-"}</td>
        <td className="hidden md:table-cell">
          {lecturerName({
            frontTitle: item?.reregisterDetail?.lecturer?.frontTitle,
            name: item?.reregisterDetail?.lecturer?.name,
            backTitle: item?.reregisterDetail?.lecturer?.backTitle,
          }) ?? "-"}
        </td>
        <td className="hidden md:table-cell">{item?.totalSks}</td>
        <td className="hidden md:table-cell">{item?.ips}</td>
        <td className="hidden md:table-cell">{item?.isStatusForm === 'APPROVED' ? 'ACC' : "Belum ACC"}</td>
      </tr>
    );
  }

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4"
    },
    {
      header: "Prodi",
      accessor: "prodi",
      className: "hidden md:table-cell",
    },
    {
      header: "Dosen Wali",
      accessor: "dosen wali",
      className: "hidden md:table-cell",
    },
    {
      header: "Total SKS",
      accessor: "sks",
      className: "hidden md:table-cell",
    },
    {
      header: "IPK",
      accessor: "ipk",
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
      className: "hidden md:table-cell",
    },
  ];
  return (
    <>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={page} count={count} />
    </>
  )
}

export default StudentsRegisteredKrs;
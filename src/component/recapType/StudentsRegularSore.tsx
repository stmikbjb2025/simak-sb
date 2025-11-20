import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Table from "../Table";
import Pagination from "../Pagination";
import { Prisma } from "@/generated/prisma/client";

type recapType = {
  periodId: string,
  page: number,
  queryParams: { [key: string]: string | undefined },
};

const StudentsRegularSore = async (
  { periodId, page, queryParams }: recapType) => {

  const query: Prisma.ReregisterDetailWhereInput = {};
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
    const data = await tx.reregisterDetail.findMany({
      where: {
        reregister: {
          periodId: periodId,
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
        campusType: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
      orderBy: [
        { campusType: "desc" },
        { student: { nim: "desc" } },
      ],
    });
    const count = await tx.reregisterDetail.count({
      where: {
        reregister: {
          periodId: periodId,
        },
        ...query,
      },
    });
    return [data, count];
  })

  const renderRow = (item: any) => {
    return (
      <tr
        key={item.student.nim}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:hidden py-4 px-2">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="font-semibold">{item?.student?.name}</h3>
            <p className="flex md:hidden text-xs text-gray-500">{item?.student?.nim ?? ""}</p>
            <p className="flex md:hidden text-xs text-gray-500">Prodi: {item?.student?.major?.name ?? ""}</p>
          </div>
        </td>
        <td className="hidden md:flex py-4 px-2 md:px-4">{item?.student?.nim || "-"}</td>
        <td className="hidden md:table-cell">{item?.student?.name || "-"}</td>
        <td className="hidden md:table-cell">{item?.student?.major?.name || "-"}</td>
        <td className="hidden md:table-cell">
          {(item.campusType === "BJM" && "BANJARMASIN") || (item.campusType === "BJB" && "BANJARBARU") || item.campusType}
        </td>
      </tr>
    );
  }

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:hidden"
    },
    {
      header: "NIM",
      accessor: "nim",
      className: "hidden md:table-cell md:px-4 md:",
    },
    {
      header: "Nama Mahasiswa",
      accessor: "nama mahasiswa",
      className: "hidden md:table-cell",
    },
    {
      header: "Program Studi",
      accessor: "program studi",
      className: "hidden md:table-cell",
    },
    {
      header: "Perkuliahan",
      accessor: "perkuliahan",
      className: "hidden md:table-cell",
    }
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

export default StudentsRegularSore;
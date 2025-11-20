import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Image from "next/image";
import Link from "next/link";
import { Period, Prisma } from "@/generated/prisma/client";

type PeriodDataType = Period;
const RecapPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.PeriodWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count] = await prisma.$transaction([
    prisma.period.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: [
        { year: "desc" },
        { semesterType: "asc" }
      ]
    }),
    prisma.period.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Periode Akademik",
      accessor: "periode akademik",
      className: "px-2 md:px-4"
    },
    {
      header: "Semester",
      accessor: "semester",
      className: "hidden md:table-cell",
    },
    {
      header: "Tahun",
      accessor: "tahun",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: PeriodDataType) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
    >
      <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
        <div className="flex flex-col col-span-5 items-start">
          <h3 className="font-semibold">{item.name}</h3>
          <p className={`rounded-lg text-[9px] font-bold self-start p-1 ${item.isActive ? "text-green-500 bg-green-100" : "text-rose-500 bg-rose-100"}`}>
            {item.isActive ? "AKTIF" : "NONAKTIF"}
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 md:hidden ">
        </div>
      </td>
      <td className="hidden md:table-cell">{item.semesterType || "-"}</td>
      <td className="hidden md:table-cell">{item.year || "-"}</td>
      <td>
        <div className="hidden md:flex items-center gap-2">
          <Link href={`/list/recapitulations/${item?.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
              <Image src="/icon/view.svg" alt="" width={20} height={20} />
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Rekapitulasi/Laporan</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default RecapPage;
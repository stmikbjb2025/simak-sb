import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { canRoleViewData } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { lecturerName } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { StudentTypes } from "@/lib/types/datatypes/type";

const TranskipOperatorPage = async (
  { searchParams }: { searchParams: { [key: string]: string | undefined } }
) => {

  const getSessionFunc = await getSession();
  if (!getSessionFunc || getSessionFunc.roleType !== "OPERATOR") {
    redirect("/");
  }
  const canViewData = await canRoleViewData("transcripts");

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.StudentWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { nim: { contains: value, mode: "insensitive" } },
            ]
            break;
          case "studentId":
            query.id = { equals: value };
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      select: {
        id: true,
        name: true,
        nim: true,
        statusRegister: true,
        studentStatus: true,
        major: true,
        lecturer: true,
        year: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: [
        { nim: "desc" }
      ],
    }),
    prisma.student.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4"
    },
    {
      header: "NIM",
      accessor: "nim",
      className: "hidden md:table-cell",
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
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: StudentTypes) => {
    const status = ["p-1 rounded-lg text-[9px] font-bold self-start m-1"];
    if (item.studentStatus === "NONAKTIF") status.push("text-rose-500 bg-rose-100");
    if (item.studentStatus === "AKTIF") status.push("text-green-500 bg-green-100");
    if (item.studentStatus === "CUTI") status.push("text-amber-500 bg-amber-100");
    if (item.studentStatus === "MENGUNDURKAN_DIRI") status.push("text-slate-600 bg-slate-100");
    if (item.studentStatus === "DO") status.push("text-gray-500 bg-gray-200");
    if (item.studentStatus === "LULUS") status.push("text-violet-600 bg-violet-100");
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="font-semibold">{item?.name || ""}</h3>
            <p className="text-xs font-medium text-gray-500">{item?.nim || ""}</p>
            <p className="text-xs text-gray-500">Angkatan: {item.year}</p>
            <div className="flex gap-1 mt-1">
              <p className="text-[10px] font-bold">
                <span className={status.join(" ")}>
                  {item.studentStatus}
                </span>
              </p>
              <p className="text-[10px] font-bold">
                <span className={item?.statusRegister ? "p-1 rounded-lg bg-cyan-100 text-cyan-700" : "p-1 rounded-lg bg-indigo-100 text-indigo-700"}>
                  {item?.statusRegister ?? "-"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <ModalAction>
              <div className="flex items-center gap-3">
                {canViewData && (
                  <Link href={`/list/transcripts/${item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                      <Image src="/icon/view.svg" alt="" width={20} height={20} />
                    </button>
                  </Link>
                )}
              </div>
            </ModalAction>
          </div>
        </td>
        <td className="hidden md:table-cell">{item?.nim || "-"}</td>
        <td className="hidden md:table-cell">{item.major?.name || "-"}</td>
        <td className="hidden md:table-cell">
          {lecturerName({
            frontTitle: item?.lecturer?.frontTitle,
            name: item?.lecturer?.name,
            backTitle: item?.lecturer?.backTitle,
          }) ?? "-"}
        </td>
        <td>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              {canViewData && (
                <Link href={`/list/transcripts/${item.id}`}>
                  <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                    <Image src="/icon/view.svg" alt="" width={20} height={20} />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </td>
      </tr >
    )
  };
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Daftar Mahasiswa</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
        </div>
      </div>
      {/* BOTTOM */}
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default TranskipOperatorPage;
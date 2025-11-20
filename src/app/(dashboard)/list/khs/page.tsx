import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { canRoleViewData } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { KhsDetailTypes, KhsTypes } from "@/lib/types/datatypes/type";


const KHSListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const user = await getSession();
  const canViewData = await canRoleViewData("khs");

  if (!canViewData) {
    redirect("/")
  }

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.KhsWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              {
                student: {
                  name: { contains: value, mode: "insensitive" }
                }
              }
            ]
            break;
          case "studentId":
            query.studentId = { equals: value };
            break;
          default:
            break;
        }
      }
    }
  };

  switch (user?.roleType) {
    case "ADVISOR":
      query.student = {
        lecturer: {
          userId: user.userId
        },
      }
      break;
    case "STUDENT":
      query.student = {
        userId: user.userId,
      }
      break;
    default:
      break;
  }


  const [data, count] = await prisma.$transaction([
    prisma.khs.findMany({
      where: query,
      include: {
        period: true,
        student: {
          include: {
            major: true,
          }
        },
        khsDetail: true,
      },
      orderBy: [
        {
          period: {
            year: "desc",
          }
        },
        {
          period: {
            semesterType: "asc",
          }
        },
        {
          student: {
            nim: "desc"
          }
        }
      ],
      take: 14,
      skip: 14 * (p - 1),
    }),
    prisma.khs.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4",
    },
    {
      header: "Periode Akademik",
      accessor: "periode akademik",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: KhsTypes & { khsDetail: KhsDetailTypes[] }) => {

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="font-semibold">{item?.student?.name ?? ""}</h3>
            <p className="hidden md:flex text-xs text-gray-500">Angkatan: {item?.student?.year ?? ""}</p>
            <p className="flex text-xs text-gray-500">{item?.student?.nim || ""}</p>
            {item.isRPL && (
              <p className="flex text-xs font-semibold bg-green-100 text-green-500 p-1 mt-1 rounded-md">{"RPL"}</p>
            )}

          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <ModalAction>
              <div className="flex items-center gap-3">
                <Link href={`/list/khs/${item.id}`}>
                  <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                    <Image src="/icon/view.svg" alt="" width={20} height={20} />
                  </button>
                </Link>
              </div>
            </ModalAction>
          </div>
        </td>
        <td className="hidden md:table-cell">{item?.period?.name ?? ""}</td>
        <td>
          <div className="hidden md:flex items-center gap-2">
            {item?.khsDetail.length > 0 && (
              <Link href={`/list/khs/${item.id}`}>
                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                  <Image src="/icon/view.svg" alt="" width={20} height={20} />
                </button>
              </Link>
            )}
          </div>
        </td >
      </tr >
    )
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Kartu Hasil Studi/RPL</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} itemPerPage={14} />
    </div>
  )
}

export default KHSListPage;
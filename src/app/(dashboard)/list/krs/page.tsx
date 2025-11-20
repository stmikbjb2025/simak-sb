import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { canRoleViewData } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { KrsTypes } from "@/lib/types/datatypes/type";

const KRSListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const user = await getSession();
  const canViewData = await canRoleViewData("krs");

  if (!canViewData) {
    redirect("/")
  }

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.KrsWhereInput = {}
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
              },
              {
                student: {
                  nim: { contains: value, mode: "insensitive" }
                }
              },
            ]
            break;
          case "studentId":
            query.studentId = { equals: value }
            break;
          default:
            break;
        }
      }
    }
  };

  switch (user?.roleType) {
    case "ADVISOR":
      query.lecturer = {
        userId: user.userId
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
    prisma.krs.findMany({
      where: query,
      include: {
        reregister: {
          include: {
            period: true,
          }
        },
        lecturer: true,
        student: {
          include: {
            major: true,
          }
        },
        krsDetail: true,
      },
      orderBy: [

        {
          reregister: {
            period: {
              year: "desc",
            }
          },
        },
        {
          reregister: {
            period: {
              semesterType: "asc",
            }
          },
        },
        {
          student: {
            nim: "desc"
          }
        }
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.krs.count({ where: query }),
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
      header: "IPK",
      accessor: "ipk",
      className: "hidden md:table-cell",
    },
    {
      header: "max. SKS",
      accessor: "max. sks",
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
      className: "hidden lg:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: KrsTypes) => {
    const isStatusForm = ["p-1 rounded-lg text-[10px] font-bold self-start"];
    if (item.isStatusForm === "DRAFT") isStatusForm.push("text-gray-500 bg-gray-200");
    if (item.isStatusForm === "SUBMITTED") isStatusForm.push("text-blue-500 bg-blue-100");
    if (item.isStatusForm === "APPROVED") isStatusForm.push("text-green-500 bg-green-100");
    if (item.isStatusForm === "REJECTED") isStatusForm.push("text-rose-500 bg-rose-100");
    if (item.isStatusForm === "NEED_REVISION") isStatusForm.push("text-yellow-500 bg-yellow-200");

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
            <p className="flex lg:hidden">
              <span className={isStatusForm.join(" ")}>
                {item?.isStatusForm || ""}
              </span>
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <ModalAction>
              <div className="flex items-center gap-3">
                <Link href={`/list/krs/${item.id}`}>
                  <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                    <Image src="/icon/view.svg" alt="" width={20} height={20} />
                  </button>
                </Link>
              </div>
            </ModalAction>
          </div>
        </td>
        <td className="hidden md:table-cell">{item?.reregister?.period?.name ?? ""}</td>
        <td className="hidden md:table-cell">{item?.ips.toString() ?? ""}</td>
        <td className="hidden md:table-cell capitalize">{item?.maxSks ?? ""}</td>
        <td className="hidden lg:table-cell capitalize">
          <span className={isStatusForm.join(" ")}>
            {item?.isStatusForm || ""}
          </span>
        </td>
        <td>
          <div className="hidden md:flex items-center gap-2">
            <Link href={`/list/krs/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                <Image src="/icon/view.svg" alt="" width={20} height={20} />
              </button>
            </Link>
            {/* {canDeleteData && (<FormContainer table="krs" type="delete" id={`${item.id}`} />)} */}
          </div>
        </td >
      </tr >
    )
  }
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center md:items-start lg:items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Daftar Kartu Rencana Studi</h1>
        <div className="flex flex-col lg:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  )
}

export default KRSListPage;
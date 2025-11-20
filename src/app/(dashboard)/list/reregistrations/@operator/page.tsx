import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { canRoleCreateData, canRoleDeleteData, canRoleUpdateData, canRoleViewData } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { ReregisterTypes } from "@/lib/types/datatypes/type";


const ReregisterOperatorPage = async (
  { searchParams }: { searchParams: { [key: string]: string | undefined } }
) => {

  const getSessionFunc = await getSession();
  if (!getSessionFunc || getSessionFunc.roleType !== "OPERATOR") {
    redirect("/");
  }

  const canCreateData = await canRoleCreateData("reregistrations");
  const canUpdateData = await canRoleUpdateData("reregistrations");
  const canDeleteData = await canRoleDeleteData("reregistrations");
  const canViewData = await canRoleViewData("reregistrations");

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.ReregisterWhereInput = {}
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
    prisma.reregister.findMany({
      where: query,
      include: {
        period: true
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: [
        {
          period: {
            year: "desc",
          }
        },
        {
          period: {
            semesterType: "asc"
          }
        }
      ]
    }),
    prisma.reregister.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4"
    },
    {
      header: "Periode Akademik",
      accessor: "periode akademik",
      className: "hidden md:table-cell",
    },
    {
      header: "Tahun",
      accessor: "tahun",
      className: "hidden md:table-cell",
    },
    {
      header: "isActivated",
      accessor: "isActivated",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: ReregisterTypes) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
    >
      <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
        <div className="flex flex-col col-span-5 items-start">
          <h3 className="font-semibold">{item?.name || ""}</h3>
          <p className="flex md:hidden">{item.period?.year || ""}</p>
          <div className="flex md:hidden text-[9px] font-bold">
            <span className={item.isReregisterActive ? "text-lime-500 bg-lime-100 p-1 rounded-lg" : "text-red-700 bg-red-100 p-1 rounded-lg"}>
              {item.isReregisterActive ? "AKTIF" : "NONAKTIF"}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 md:hidden ">
          <ModalAction>
            <div className="flex items-center gap-3">
              {canViewData && (
                <Link href={`/list/reregistrations/${item.id}`}>
                  <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                    <Image src="/icon/view.svg" alt="" width={20} height={20} />
                  </button>
                </Link>
              )}
              {canUpdateData && (<FormContainer table="reregistration" type="update" data={item} />)}
              {canDeleteData && (<FormContainer table="reregistration" type="delete" id={item.id} />)}
            </div>
          </ModalAction>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.period?.name || "-"}</td>
      <td className="hidden md:table-cell">{item.period?.year || "-"}</td>
      <td className="hidden md:table-cell text-[10px] font-bold">
        <span className={item.isReregisterActive ? "text-lime-500 bg-lime-100 p-1 rounded-lg" : "text-red-700 bg-red-100 p-1 rounded-lg"}>
          {item.isReregisterActive ? "AKTIF" : "NONAKTIF"}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            {canViewData && (
              <Link href={`/list/reregistrations/${item.id}`}>
                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                  <Image src="/icon/view.svg" alt="" width={20} height={20} />
                </button>
              </Link>
            )}
            {canUpdateData && (<FormContainer table="reregistration" type="update" data={item} />)}
            {canDeleteData && (<FormContainer table="reregistration" type="delete" id={item.id} />)}
          </div>
        </div>
      </td>
    </tr >
  );
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Daftar Herregistrasi</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {canCreateData && (<FormContainer table="reregistration" type="create" />)}
          </div>
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

export default ReregisterOperatorPage;
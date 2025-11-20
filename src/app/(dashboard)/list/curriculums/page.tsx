import FilterSearch from "@/component/FilterSearch";
import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { canRoleCreateData, canRoleDeleteData, canRoleUpdateData, canRoleViewData } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { CurriculumTypes } from "@/lib/types/datatypes/type";

const CurriculumListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const canCreateData = await canRoleCreateData("courses");
  const canUpdateData = await canRoleUpdateData("courses");
  const canDeleteData = await canRoleDeleteData("courses");
  const canViewData = await canRoleViewData("courses");

  if (!canViewData) {
    redirect("/")
  }

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.CurriculumWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          case "filter":
            query.majorId = parseInt(value)
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count, dataFilter] = await prisma.$transaction([
    prisma.curriculum.findMany({
      where: query,
      include: {
        major: {
          select: {
            id: true,
            name: true
          },
        },
      },
      orderBy: [
        { startDate: "desc" },
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.curriculum.count({ where: query }),
    prisma.major.findMany({
      select: { id: true, name: true }
    })
  ]);


  const columns = [
    {
      header: "Info Kurikulum",
      accessor: "info kurikulum",
      className: "px-2 md:px-4",
    },
    {
      header: "Program Studi",
      accessor: "program studi",
      className: "hidden md:table-cell",
    },
    {
      header: "Tanggal Mulai",
      accessor: "tanggal mulai",
      className: "hidden md:table-cell",
    },
    {
      header: "Tanggal Selesai",
      accessor: "tanggal selesai",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: CurriculumTypes) => (
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
          <ModalAction>
            <div className="flex items-center gap-3">
              <Link href={`/list/curriculums/${item.id}`}>
                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                  <Image src="/icon/view.svg" alt="" width={20} height={20} />
                </button>
              </Link>
              {canUpdateData && <FormContainer table="curriculum" type="update" data={item} />}
              {canDeleteData && <FormContainer table="curriculum" type="delete" id={item.id} />}
            </div>
          </ModalAction>
        </div>
      </td>
      <td className="hidden md:table-cell capitalize">{item.major?.name}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("id-ID").format(item.startDate || Date.now())}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("id-ID").format(item.endDate || Date.now())}</td>
      <td>
        <div className="hidden md:flex items-center gap-2">
          <Link href={`/list/curriculums/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
              <Image src="/icon/view.svg" alt="" width={20} height={20} />
            </button>
          </Link>
          {canUpdateData && <FormContainer table="curriculum" type="update" data={item} />}
          {canDeleteData && <FormContainer table="curriculum" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Daftar Kurikulum</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {canCreateData && (
              <FormContainer table="curriculum" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* filter badge */}
      <FilterSearch data={dataFilter} />
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default CurriculumListPage;
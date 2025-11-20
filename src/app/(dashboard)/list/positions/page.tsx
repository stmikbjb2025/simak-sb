import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { canRoleCreateData, canRoleDeleteData, canRoleUpdateData, canRoleViewData } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { PositionTypes } from "@/lib/types/datatypes/type";

const PositionListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const canCreateData = await canRoleCreateData("positions");
  const canUpdateData = await canRoleUpdateData("positions");
  const canDeleteData = await canRoleDeleteData("positions");
  const canViewData = await canRoleViewData("positions");
  if (!canViewData) {
    redirect("/")
  }

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.PositionWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { positionName: { contains: value, mode: "insensitive" } },
              { personName: { contains: value, mode: "insensitive" } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count] = await prisma.$transaction([
    prisma.position.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.position.count({ where: query }),
  ]);

  const renderRow = (item: PositionTypes) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
    >
      <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
        <div className="flex flex-col col-span-5 items-start">
          <h3 className="font-semibold">{item.personName}</h3>
          <p className="flex md:hidden text-xs text-gray-500">{item.positionName}</p>
        </div>
        <div className="flex items-center justify-end gap-2 md:hidden ">
          <ModalAction>
            <div className="flex items-center gap-3">
              {canUpdateData && (<FormContainer table="position" type="update" data={item} />)}
              {canDeleteData && (<FormContainer table="position" type="delete" id={item.id} />)}
            </div>
          </ModalAction>
        </div>

      </td>
      <td className="hidden md:table-cell">{item.positionName}</td>
      <td>
        <div className="hidden md:flex items-center gap-2">
          {canUpdateData && <FormContainer table="position" type="update" data={item} />}
          {canDeleteData && <FormContainer table="position" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );

  const columns = [
    {
      header: "Nama Lengkap",
      accessor: "nama lengkap",
      className: "px-2 md:px-4"
    },
    {
      header: "Posisi",
      accessor: "posisi",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Daftar Jabatan</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {canCreateData && (<FormContainer table="position" type="create" />)}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default PositionListPage;
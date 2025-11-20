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
import { MajorTypes } from "@/lib/types/datatypes/type";

const MajorListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const canCreateData = await canRoleCreateData("majors");
  const canUpdateData = await canRoleUpdateData("majors");
  const canDeleteData = await canRoleDeleteData("majors");
  const canViewData = await canRoleViewData("majors");

  if (!canViewData) {
    redirect("/")
  }

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.MajorWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { stringCode: { contains: value, mode: "insensitive" } },
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
    prisma.major.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.major.count({ where: query }),
  ]);

  const renderRow = (item: MajorTypes) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-100 text-sm hover:bg-ternary-light"
    >
      <td className="hidden md:table-cell md:px-4">{item.stringCode}</td>
      <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-0">
        <div className="flex flex-col col-span-5 items-start">
          <h3 className="font-semibold">{item.name}</h3>
        </div>
        <div className="flex items-center justify-end gap-2 md:hidden ">
          <ModalAction>
            <div className="flex items-center gap-3">
              {canUpdateData && (<FormContainer table="major" type="update" data={item} />)}
              {canDeleteData && (<FormContainer table="major" type="delete" id={item.id} />)}
            </div>
          </ModalAction>
        </div>
      </td>
      <td>
        <div className="hidden md:flex items-center gap-2">
          {canUpdateData && (<FormContainer table="major" type="update" data={item} />)}
          {canDeleteData && (<FormContainer table="major" type="delete" id={item.id} />)}
        </div>
      </td>
    </tr>
  );

  const columns = [
    {
      header: "Kode Program Studi",
      accessor: "kode program studi",
      className: "hidden md:table-cell md:px-4",
    },
    {
      header: "Program Studi",
      accessor: "program studi",
      className: "px-2 md:px-0"
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
        <h1 className="hidden md:block text-lg font-semibold">Program Studi</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {canCreateData && (<FormContainer table="major" type="create" />)}
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

export default MajorListPage;
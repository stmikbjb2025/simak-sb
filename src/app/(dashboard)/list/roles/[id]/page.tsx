'use server';
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import ToggleSwitch from "@/component/ToggleSwitch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Prisma } from "@/generated/prisma/client";
import { PermissionTypes } from "@/lib/types/datatypes/type";

// type PermissionDataType = Permission;

const SingleRolePage = async (
  {
    searchParams,
    params
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>,
    params: Promise<{ id: string }>
  },
) => {

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const { id } = await params;

  const query: Prisma.PermissionWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { description: { contains: value, mode: "insensitive" } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [dataRole, data, count] = await prisma.$transaction([
    prisma.role.findFirst({
      where: { id: parseInt(id) }
    }),

    prisma.permission.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),

    prisma.permission.count({ where: query }),
  ]);

  const renderRow = (item: PermissionTypes) => (
    <tr
      key={item.id}
    >
      <td className="py-4 px-2 md:px-4 font-semibold">{item.name}</td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td>
        <div className="flex items-center gap-2">
          <ToggleSwitch id={`${id}:${item.id}`} />
        </div>
      </td>
    </tr >
  );

  const columns = [
    {
      header: "Hak Akses",
      accessor: "hak akses",
      className: "px-2 md:px-4",
    },
    {
      header: "Deskripsi",
      accessor: "deskripsi",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between md:mb-4">
        <h1 className="hidden md:block text-lg font-semibold ">Hak akses untuk {dataRole?.name}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
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

export default SingleRolePage;
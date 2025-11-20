import FilterSearch from "@/component/FilterSearch";
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
import { CourseTypes } from "@/lib/types/datatypes/type";

const CourseListPage = async (
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

  const query: Prisma.CourseWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { code: { contains: value, mode: "insensitive" } },
              { name: { contains: value, mode: "insensitive" } },
            ]
            break;
          case "filter":
            query.OR = [
              { majorId: parseInt(value) }
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count, dataFilter] = await prisma.$transaction([
    prisma.course.findMany({
      where: query,
      select: {
        id: true,
        code: true,
        name: true,
        sks: true,
        courseType: true,
        majorId: true,
        assessmentId: true,
        isPKL: true,
        isSkripsi: true,
        predecessorId: true,
        predecessor: {
          select: {
            id: true,
            code: true,
            name: true,
          }
        },
        major: {
          select: {
            stringCode: true,
            name: true,
          },
        },
      },
      orderBy: [
        { createdAt: "desc" },
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.course.count({ where: query }),
    prisma.major.findMany({
      select: { id: true, name: true }
    })
  ]);
  dataFilter.unshift({ id: "all", name: "Semua" })

  const columns = [
    {
      header: "Mata Kuliah",
      accessor: "mata kuliah",
      className: "px-2 md:px-4",
    },
    {
      header: "Prodi",
      accessor: "prodi",
      className: "hidden md:table-cell",
    },
    {
      header: "SKS",
      accessor: "sks",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: CourseTypes) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
    >
      <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
        <div className="flex flex-col col-span-5 items-start">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="font-medium text-xs text-gray-700">{item.code}</p>
          <p className="flex md:hidden">{item.sks} sks</p>
        </div>
        <div className="flex items-center justify-end gap-2 md:hidden ">
          <ModalAction>
            <div className="flex items-center gap-3">
              {canUpdateData && <FormContainer table="course" type="update" data={item} />}
              {canDeleteData && <FormContainer table="course" type="delete" id={item.id} />}
            </div>
          </ModalAction>
        </div>
      </td>
      <td className="hidden md:table-cell capitalize">{item.major?.stringCode}</td>
      <td className="hidden md:table-cell">{item.sks}</td>
      <td>
        <div className="hidden md:flex items-center gap-2">
          {canUpdateData && <FormContainer table="course" type="update" data={item} />}
          {canDeleteData && <FormContainer table="course" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Data Mata Kuliah</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {canCreateData && (
              <FormContainer table="course" type="create" />
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

export default CourseListPage;
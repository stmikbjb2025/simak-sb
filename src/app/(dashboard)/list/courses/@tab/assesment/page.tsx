import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Prisma } from "@/generated/prisma/client";
import { AssessmentDetailTypes, AssessmentTypes } from "@/lib/types/datatypes/type";

const AssesmentListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const query: Prisma.AssessmentWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.assessment.findMany({
      where: query,
      include: {
        assessmentDetail: {
          include: {
            grade: true,
          },
          orderBy: [
            { seq_number: 'desc' }
          ],
        },
      },
      orderBy: { name: "asc" },
      skip: (p - 1) * ITEM_PER_PAGE,
      take: ITEM_PER_PAGE,
    }),
    prisma.assessment.count({ where: query }),
  ]);

  const columns = [
    {
      header: "Komponen Nilai",
      accessor: "komponen nilai",
      className: "px-2 md:px-4",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: AssessmentTypes & { assessmentDetail: AssessmentDetailTypes[] }) => {
    const dataEdit = {
      id: item.id,
      name: item.name,
      gradeComponents: item.assessmentDetail.map((assessment: AssessmentDetailTypes) => ({
        id: assessment.grade.id,
        percentage: assessment.percentage,
      }))
    }

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="font-semibold">{item.name}</h3>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <ModalAction>
              <div className="flex items-center gap-3">
                <FormContainer table="assessment" type="update" data={dataEdit} />
                <FormContainer table="assessment" type="delete" id={item.id} />
              </div>
            </ModalAction>
          </div>
        </td>
        <td>
          <div className="hidden md:flex items-center gap-2">
            <FormContainer table="assessment" type="update" data={dataEdit} />
            <FormContainer table="assessment" type="delete" id={item.id} />
          </div>
        </td>
      </tr>
    )
  }
  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Bentuk Penilaian</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="assessment" type="create" />
          </div>
        </div>
      </div>
      {/* filter badge */}
      {/* <FilterSearch data={dataFilter} /> */}
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default AssesmentListPage;
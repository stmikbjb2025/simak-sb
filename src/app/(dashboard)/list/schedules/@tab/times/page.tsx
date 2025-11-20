import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { Prisma } from "@/generated/prisma/client";
import { TimeTypes } from "@/lib/types/datatypes/type";

// interface TimeDataType {
//   id: string;
//   timeStart: Date;
//   timeFinish: Date;
// }

const TimeListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.TimeWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          default:
            break;
        }
      }
    }
  };

  const [data, count] = await prisma.$transaction([
    prisma.time.findMany({
      where: query,
      orderBy: [
        { timeStart: "asc" },
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.time.count({
      where: query,
    }),
  ])

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4"
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: TimeTypes) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
    >
      <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
        <div className="flex flex-col col-span-5 items-start">
          <h3 className="font-semibold">
            {new Intl.DateTimeFormat("id-ID", { hour: "numeric", minute: "numeric" }).format(item.timeStart)} - {new Intl.DateTimeFormat("id-ID", { hour: "numeric", minute: "numeric" }).format(item.timeFinish)}
          </h3>
        </div>
        <div className="flex items-center justify-end gap-2 md:hidden ">
          <ModalAction>
            <div className="flex items-center gap-3">
              <FormContainer table="time" type="update" data={item} />
              <FormContainer table="time" type="delete" id={item.id} />
            </div>
          </ModalAction>
        </div>
      </td>
      <td>
        <div className="hidden md:flex items-center gap-2">
          <FormContainer table="time" type="update" data={item} />
          <FormContainer table="time" type="delete" id={item.id} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Data Waktu Pelajaran</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            <FormContainer table="time" type="create" />
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default TimeListPage;
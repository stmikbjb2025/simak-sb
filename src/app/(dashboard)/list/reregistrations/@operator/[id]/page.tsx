
import ButtonPdfDownload from "@/component/ButtonPdfDownload";
import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Image from "next/image";
import { Prisma } from "@/generated/prisma/client";
import { ReregisterDetailTypes } from "@/lib/types/datatypes/type";

const ReregisterSinglePage = async (
  {
    searchParams, params
  }: {
    searchParams: Promise<{ [key: string]: string | undefined }>,
    params: Promise<{ id: string }>
  }
) => {

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const { id } = await params;
  const session = await getSession();

  const query: Prisma.ReregisterDetailWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { student: { name: { contains: value, mode: "insensitive" } } },
              { student: { nim: { contains: value, mode: "insensitive" } } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };
  const dataReregis = await prisma.reregister.findUnique({
    where: { id: id },
    include: { period: true },
  });
  const dataCreate = {
    reregisterId: dataReregis.id,
    name: dataReregis.name,
    semesterType: dataReregis.period.semesterType,
    year: dataReregis.period.year,
  }

  const [data, count] = await prisma.$transaction([
    prisma.reregisterDetail.findMany({
      where: {
        reregisterId: id,
        ...query,
      },
      include: {
        student: {
          include: {
            major: true,
          }
        },
        reregister: {
          include: {
            period: true,
          }
        }
      },
      orderBy: [
        {
          student: {
            nim: "desc"
          }
        }
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.reregisterDetail.count({
      where: {
        reregisterId: id,
        ...query,
      },
    }),
  ]);

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4"
    },
    {
      header: "Angkatan",
      accessor: "angkatan",
      className: "hidden lg:table-cell",
    },
    {
      header: "Prodi",
      accessor: "prodi",
      className: "hidden md:table-cell",
    },
    {
      header: "Kampus",
      accessor: "kampus",
      className: "hidden md:table-cell",
    },
    {
      header: "Pembayaran",
      accessor: "pembayaran",
      className: "hidden md:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
      className: "hidden md:table-cell",
    },
    {
      header: "isSubmited",
      accessor: "isSubmited",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: ReregisterDetailTypes) => {
    const paymentStyle = ["p-1 rounded-lg"];
    const semesterStyle = ["p-1 rounded-lg"];
    if (item.paymentStatus === "BELUM_LUNAS") paymentStyle.push("text-red-700 bg-red-100");
    if (item.paymentStatus === "LUNAS") paymentStyle.push("text-lime-500 bg-lime-100");
    if (item.semesterStatus === "NONAKTIF") semesterStyle.push("text-rose-500 bg-rose-100");
    if (item.semesterStatus === "AKTIF") semesterStyle.push("text-green-500 bg-green-100");
    if (item.semesterStatus === "CUTI") semesterStyle.push("text-amber-500 bg-amber-100");
    if (item.semesterStatus === "MENGUNDURKAN_DIRI") semesterStyle.push("text-slate-600 bg-slate-100");
    if (item.semesterStatus === "DO") semesterStyle.push("text-gray-500 bg-gray-200");
    if (item.semesterStatus === "LULUS") semesterStyle.push("text-violet-600 bg-violet-100");

    return (
      <tr
        key={item.student.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="text-sm font-semibold">{item.student.name}</h3>
            <p className="text-xs text-gray-600">{item.student.nim}</p>
            <p className="text-xs text-gray-400">{`Semester ${item.semester || 0}`}</p>
            <div className="flex md:hidden gap-1 mt-1">
              <p className=" text-[9px] font-bold">
                <span className={paymentStyle.join(" ")}>
                  {item.paymentStatus}
                </span>
              </p>
              <p className="text-[9px] font-bold">
                <span className={semesterStyle.join(" ")}>
                  {item.semesterStatus}
                </span>
              </p>
              <p className="text-[9px] font-bold">
                <span className={item.isStatusForm ? "p-1 rounded-lg bg-emerald-100 text-emerald-500" : "p-1 rounded-lg bg-red-100 text-red-700"}>
                  {item.isStatusForm ? "Telah Diisi" : "Belum Diisi"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <ModalAction>
              <div className="flex items-center gap-3">
                <FormContainer table="reregistrationDetail" type="update" data={item} />
                {session?.roleName === "admin" && (<FormContainer table="reregistrationDetail" type="delete" id={`${item.reregister.id}:${item.student.id}`} />)}
              </div>
            </ModalAction>
          </div>
        </td>
        <td className="hidden lg:table-cell text-sm font-medium">{item.student.year || ""}</td>
        <td className="hidden md:table-cell text-sm font-medium">{item?.student?.major?.stringCode}</td>
        <td className="hidden md:table-cell text-sm">{item?.campusType}</td>
        <td className={`hidden md:table-cell text-[10px] font-bold`}>
          <span className={paymentStyle.join(" ")}>
            {item.paymentStatus}
          </span>
        </td>
        <td className="hidden md:table-cell text-[10px] font-bold">
          <span className={semesterStyle.join(" ")}>
            {item.semesterStatus}
          </span>
        </td>
        <td className="hidden md:table-cell text-[10px] font-bold">
          <span className={item.isStatusForm ? "p-1 rounded-lg bg-emerald-100 text-emerald-500" : "p-1 rounded-lg bg-red-100 text-red-700"}>
            {item.isStatusForm ? "Telah Diisi" : "Belum Diisi"}
          </span>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              {(session?.roleName === "admin" && item.isStatusForm) && (
                <ButtonPdfDownload type="reregister" id={`${item.reregister.id}:${item.student.id}`}>
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full bg-primary-dark`}>
                    <Image src={`/icon/printPdf.svg`} alt={`icon-print}`} width={20} height={20} />
                  </div>
                </ButtonPdfDownload>
              )}
              <FormContainer table="reregistrationDetail" type="update" data={item} />
              {session?.roleName === "admin" && (<FormContainer table="reregistrationDetail" type="delete" id={`${item.reregister.id}:${item.student.id}`} />)}
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold"> {dataCreate?.name}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          {session?.roleName === "admin" && (
            <div className="flex items-center gap-4 self-end">
              <FormContainer table="reregistrationCreateAll" type="createMany" data={dataCreate} />
              <FormContainer table="reregistrationDetail" type="create" data={dataCreate} />
            </div>
          )}
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

export default ReregisterSinglePage;
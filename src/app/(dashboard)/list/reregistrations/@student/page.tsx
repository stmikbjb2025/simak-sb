import ButtonPdfDownload from "@/component/ButtonPdfDownload";
import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { ReregisterDetailTypes } from "@/lib/types/datatypes/type";

// type ReregisterDetailDataType = ReregisterDetail & { reregister: Reregister & { period: Period } } & { student: Student & { lecturer: Lecturer } & { major: Major } };

const ReregisterStudentPage = async (
  { searchParams }: { searchParams: { [key: string]: string | undefined } }
) => {
  const getUser = await getSession();

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  let data;
  let count;

  if (!getUser || getUser.roleType !== 'STUDENT') {
    redirect("/")
  } else {
    const studentUser = await prisma.user.findUnique({
      where: { id: getUser.userId },
      include: { student: true }
    });

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

    [data, count] = await prisma.$transaction([
      prisma.reregisterDetail.findMany({
        where: {
          studentId: studentUser.student.id,
        },
        include: {
          reregister: {
            include: {
              period: true,
            },
          },
          student: {
            include: {
              lecturer: true,
              major: true,
            },
          },
        },
        orderBy: [
          {
            reregister: {
              period: {
                year: "asc",
              },
            },
          },
          {
            reregister: {
              period: {
                semesterType: "desc"
              }
            },
          },
        ],
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
      }),
      prisma.reregisterDetail.count({
        where: {
          studentId: studentUser.student.id,
        },
      }),
    ])
  };

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
      header: "semester",
      accessor: "semester",
      className: "hidden md:table-cell",
    },
    {
      header: "Pembayaran",
      accessor: "pembayaran",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: ReregisterDetailTypes) => (
    <tr
      key={item.reregister.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
    >
      <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
        <div className="flex flex-col col-span-5 items-start">
          <h3 className="font-semibold">{item.reregister.name}</h3>
          <p className="flex md:hidden text-xs">{item.reregister?.period?.name || ""}</p>
          <p className="flex md:hidden text-xs">Semester {item.semester || "xx"}</p>
        </div>
        <div className="flex items-center justify-end gap-2 md:hidden ">
          <FormContainer table="reregistrationStudent" type="update" data={item} />
        </div>
      </td>
      <td className="hidden md:table-cell">{item.reregister?.period?.name || "-"}</td>
      <td className="hidden md:table-cell">{item.semester || "-"}</td>
      <td className="hidden md:table-cell text-[10px] font-bold">
        <span className={item.paymentStatus === "LUNAS" ? "text-lime-500 bg-lime-100 p-1 rounded-lg" : "text-red-700 bg-red-100 p-1 rounded-lg"}>
          {item.paymentStatus}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            {(item.paymentStatus === "LUNAS" && !item.isStatusForm) && (
              <FormContainer table="reregistrationStudent" type="update" data={item} />
            )}
            {(item.paymentStatus === "LUNAS" && item.isStatusForm) && (
              <ButtonPdfDownload type="reregister" id={`${item.reregister.id}:${item.student.id}`}>
                <div className={`w-7 h-7 flex items-center justify-center rounded-full bg-primary-dark`}>
                  <Image src={`/icon/printPdf.svg`} alt={`icon-print}`} width={20} height={20} />
                </div>
              </ButtonPdfDownload>
            )}
          </div>
        </div>
      </td>
    </tr >
  );
  return (<div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    {/* TOP */}
    <div className="flex items-center justify-between"> <h1 className="hidden md:block text-lg font-semibold">Herregistrasi Mahasiswa</h1> <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto"> <TableSearch /> </div> </div>
    {/* BOTTOM */}
    {/* LIST */}
    <Table columns={columns} renderRow={renderRow} data={data} />
    {/* PAGINATION \*/}
    <Pagination page={p} count={count} /></div>
  )
}

export default ReregisterStudentPage;
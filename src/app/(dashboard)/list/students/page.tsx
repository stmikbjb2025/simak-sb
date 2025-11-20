import FilterSearch from "@/component/FilterSearch";
import FormContainer from "@/component/FormContainer";
import ModalAction from "@/component/ModalAction";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { canRoleCreateData, canRoleCreateDataUser, canRoleDeleteData, canRoleUpdateData, canRoleViewData } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { lecturerName } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { StudentTypes } from "@/lib/types/datatypes/type";

// type StudentDataType = Student & { major: Major } & { user: User } & { lecturer: Lecturer };

const StudentListPage = async (
  { searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }
) => {
  const user = await getSession();
  const canCreateData = await canRoleCreateData("students");
  const canUpdateData = await canRoleUpdateData("students");
  const canDeleteData = await canRoleDeleteData("students");
  const canViewData = await canRoleViewData("students");
  const canCreateUser = await canRoleCreateDataUser();

  if (!canViewData) {
    redirect("/")
  }

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.StudentWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { nim: { contains: value } },
              { lecturer: { name: { contains: value, mode: "insensitive" } } }
            ]
            break;
          case "filter":
            query.majorId = parseInt(value)
            break;
          case "lecturerId":
            query.lecturerId = { equals: value }
            break;
          default:
            break;
        }
      }
    }
  };

  if (user?.roleType === "ADVISOR") {
    query.lecturer = {
      userId: user.userId,
    }
  }

  const [data, count, dataFilter] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        major: {
          select: {
            name: true,
            id: true
          }
        },
        user: true,
        lecturer: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: [
        { nim: "desc" }
      ],
    }),
    prisma.student.count({ where: query }),
    prisma.major.findMany({
      select: { id: true, name: true }
    })
  ]);
  dataFilter.unshift({ id: "all", name: "Semua" })

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4",
    },
    {
      header: "NIM",
      accessor: "nim",
      className: "hidden md:table-cell",
    },
    {
      header: "Program Studi",
      accessor: "program studi",
      className: "hidden md:table-cell",
    },
    {
      header: "Perwalian",
      accessor: "perwalian",
      className: "hidden lg:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: StudentTypes) => {
    const semesterStyle = ["p-1 rounded-lg text-[9px] font-bold self-start"];
    if (item.studentStatus === "NONAKTIF") semesterStyle.push("text-rose-500 bg-rose-100");
    if (item.studentStatus === "AKTIF") semesterStyle.push("text-green-500 bg-green-100");
    if (item.studentStatus === "CUTI") semesterStyle.push("text-amber-500 bg-amber-100");
    if (item.studentStatus === "MENGUNDURKAN_DIRI") semesterStyle.push("text-slate-600 bg-slate-100");
    if (item.studentStatus === "DO") semesterStyle.push("text-gray-500 bg-gray-200");
    if (item.studentStatus === "LULUS") semesterStyle.push("text-violet-600 bg-violet-100");
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start md:flex-row md:items-center gap-4 ">
            <Image
              src={item.photo ? `/api/avatar?file=${item.photo}` : '/avatar.png'}
              alt=""
              width={40}
              height={40}
              className="hidden lg:block w-16 h-16 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="hidden md:flex text-xs text-gray-500">Angkatan: {item.year}</p>
              <p className="flex md:hidden text-xs text-gray-500">{item?.nim || ""}</p>
              <p className="text-xs text-gray-500">{item.user?.email || ""}</p>
              <p className={semesterStyle.join(" ")}>{item.studentStatus}</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <ModalAction>
              <div className="flex items-center gap-3">
                {canViewData && (
                  <Link href={`/list/students/${item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                      <Image src="/icon/view.svg" alt="" width={20} height={20} />
                    </button>
                  </Link>
                )}
                {canUpdateData && <FormContainer table="student" type="update" data={item} />}
                {canCreateUser && (<FormContainer table="studentUser" type={item.user ? "updateUser" : "createUser"} data={item} />)}
                {canDeleteData && (<FormContainer table="student" type="delete" id={`${item.id}:${item?.user?.id}`} />)}
              </div>
            </ModalAction>
          </div>
        </td>
        <td className="hidden md:table-cell">{item?.nim || "-"}</td>
        <td className="hidden md:table-cell">{item.major?.name || "-"}</td>
        <td className="hidden lg:table-cell">
          {lecturerName({
            frontTitle: item?.lecturer?.frontTitle,
            name: item?.lecturer?.name,
            backTitle: item?.lecturer?.backTitle,
          }) ?? "-"}
        </td>
        <td>
          <div className="hidden md:flex items-center gap-2">
            {canViewData && (
              <Link href={`/list/students/${item.id}`}>
                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-ternary">
                  <Image src="/icon/view.svg" alt="" width={20} height={20} />
                </button>
              </Link>
            )}
            {canUpdateData && <FormContainer table="student" type="update" data={item} />}
            {canCreateUser && (<FormContainer table="studentUser" type={item.user ? "updateUser" : "createUser"} data={item} />)}
            {canDeleteData && (<FormContainer table="student" type="delete" id={`${item.id}:${item?.user?.id}`} />)}
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Data Mahasiswa</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {canCreateData && (<FormContainer table="student" type="create" />)}
          </div>
        </div>
      </div>
      <FilterSearch data={dataFilter} />
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  )
}

export default StudentListPage;
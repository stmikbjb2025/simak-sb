import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableFilter from "@/component/TableFilter";
import TableSearch from "@/component/TableSearch";
import { canRoleCreateData, canRoleDeleteData, canRoleViewData } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { CurriculumDetailTypes } from "@/lib/types/datatypes/type";

// type CurriculumDetailDataType = CurriculumDetail & { course: Course };

const CurriculumSinglePage = async (
  { searchParams, params }: {
    searchParams: Promise<{ [key: string]: string | undefined }>,
    params: Promise<{ id: string }>
  }
) => {
  const canCreateData = await canRoleCreateData("courses");
  const canDeleteData = await canRoleDeleteData("courses");
  const canViewData = await canRoleViewData("courses");

  if (!canViewData) {
    redirect("/")
  }

  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;
  const { id } = await params;

  const query: Prisma.CurriculumDetailWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { course: { name: { contains: value, mode: "insensitive" } } },
              { course: { code: { contains: value, mode: "insensitive" } } },
            ];
            break;
          case "filter":
            query.semester = parseInt(value)
            break;
          default:
            break;
        }
      }
    }
  };

  const dataCurriculum = await prisma.curriculum.findUnique({
    where: { id: id },
    include: {
      major: true,
    }
  });
  const dataCreate = {
    curriculumId: dataCurriculum?.id,
    name: dataCurriculum?.name,
    majorId: dataCurriculum?.majorId,
  };


  const dataFilter = [
    { id: "all", name: "Semua" },
    { id: "1", name: "Semester 1" },
    { id: "2", name: "Semester 2" },
    { id: "3", name: "Semester 3" },
    { id: "4", name: "Semester 4" },
    { id: "5", name: "Semester 5" },
    { id: "6", name: "Semester 6" },
    { id: "7", name: "Semester 7" },
    { id: "8", name: "Semester 8" },
  ]

  const [data, count] = await prisma.$transaction([
    prisma.curriculumDetail.findMany({
      where: {
        curriculumId: id,
        ...query,
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            code: true,
            sks: true,
          },
        },
      },
      orderBy: [
        { semester: "asc" },
        { course: { code: "asc" } }
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.curriculumDetail.count({
      where: {
        curriculumId: id,
        ...query,
      },
    }),
  ]);


  const columns = [
    {
      header: "Semester",
      accessor: "semester",
      className: "px-2 md:px-4"
    },
    {
      header: "Kode Mata Kuliah",
      accessor: "kode",
      className: "hidden md:table-cell",
    },
    {
      header: "Mata Kuliah",
      accessor: "mata kuliah",
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

  const renderRow = (item: CurriculumDetailTypes) => {
    const arrSemester = ["SATU", "DUA", "TIGA", "EMPAT", "LIMA", "ENAM", "TUJUH", "DELAPAN"];
    const style = [`grid grid-cols-6 md:flex py-4 px-2 md:px-4 md:w-28`];
    if (item?.semester === 1) {
      style.push("bg-primary-light");
    } else if (item?.semester === 2) {
      style.push("bg-secondary-light");
    } else if (item?.semester === 3) {
      style.push("bg-ternary-light");
    } else if (item?.semester === 4) {
      style.push("bg-accent-light");
    } else if (item?.semester === 5) {
      style.push("bg-primary-light");
    } else if (item?.semester === 6) {
      style.push("bg-secondary-light");
    } else if (item?.semester === 7) {
      style.push("bg-ternary-light");
    } else if (item?.semester === 8) {
      style.push("bg-accent-light");
    }

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className={style.join(" ")}>
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="font-semibold text-sm">{`${arrSemester[item.semester! - 1]} (${item?.semester})`}</h3>
            <p className="flex text-xs md:hidden">{`${item.course.code ?? "-"} | ${item.course.name ?? "-"}`}</p>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            {canDeleteData && <FormContainer table="curriculumDetail" type="delete" id={item.id} />}
          </div>
        </td>
        <td className="hidden md:table-cell">{item.course.code ?? "SB-III-000"}</td>
        <td className="hidden md:table-cell">{item.course.name ?? "--"}</td>
        <td className="hidden md:table-cell">{item.course.sks ?? "--"}</td>
        <td>
          <div className="hidden md:flex items-center gap-2">
            {canDeleteData && <FormContainer table="curriculumDetail" type="delete" id={item.id} />}
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex flex-col md:flex-row items-center justify-between md:mb-6">
        <div className="flex flex-col items-start mb-4 md:mb-0 ">
          <h1 className="text-lg font-semibold">Daftar Mata kuliah {dataCurriculum.name}</h1>
          <h2 className="text-sm font-semibold text-gray-500">Prodi {dataCurriculum.major?.name} </h2>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <TableFilter data={dataFilter} />
            {canCreateData && (
              <FormContainer table="curriculumDetail" type="create" data={dataCreate} />
            )}
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

export default CurriculumSinglePage;
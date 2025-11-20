import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Table from "../Table";
import Pagination from "../Pagination";
import { Prisma } from "@/generated/prisma/client";

type recapType = {
  periodId: string,
  page: number,
  queryParams: { [key: string]: string | undefined },
};

const CourseKrs = async (
  { periodId, page, queryParams }: recapType) => {

  const query: Prisma.CurriculumDetailWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { course: { name: { contains: value, mode: "insensitive" } } },
              { course: { code: { contains: value, mode: "insensitive" } } },
            ]
            break;
          case "filter":
            query.OR = [
              { course: { majorId: parseInt(value) } },
            ]
            break;

          default:
            break;
        }
      }
    }
  };

  const [data, count] = await prisma.$transaction(async (tx: any) => {
    const periodForQuery = await tx.period.findUnique({
      where: {
        id: periodId,
      },
    });
    const semesterQuery = periodForQuery?.semesterType === "GANJIL" ? [1, 3, 5, 7] : [2, 4, 6, 8];
    const data = await tx.curriculumDetail.findMany({
      where: {
        ...query,
        semester: { in: semesterQuery },
        curriculum: {
          isActive: true,
        },
      },
      include: {
        course: true,
        curriculum: true,
      },
      orderBy: [
        { curriculum: { major: { name: "asc" } } },
        { semester: "asc" },
      ],
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    });
    const count = await tx.curriculumDetail.count({
      where: {
        ...query,
        semester: { in: semesterQuery },
        curriculum: {
          isActive: true,
        },
      },
    });

    const countCourseInKrsDetail = await tx.krsDetail.count({
      where: {
        krs: {
          reregister: {
            period: {
              id: periodId,
            }
          }
        }
      }
    });
    let countCourseTaken = [];
    if (countCourseInKrsDetail >= 1) {
      countCourseTaken = await tx.krsDetail.groupBy({
        by: ["courseId"],
        where: {
          krs: {
            reregister: {
              period: {
                id: periodId,
              },
            },
          },
        },
        _count: {
          courseId: true,
        },
      });
    };

    const dataFinal = data.map((item: any) => {
      return {
        ...item,
        studentCount: countCourseTaken.find((items: any) => item.courseId === items.courseId)?._count?.courseId || 0,
      };
    });

    return [dataFinal, count]
  });

  const renderRow = (item: any) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-6 items-start">
            <p className="flex text-xs text-gray-500">{item?.course?.code ?? ""}</p>
            <h3 className="font-semibold">{item?.course?.name ?? ""}</h3>
            <p className="flex xl:hidden text-xs text-gray-500">{'MK semester: ' + item.semester} | {'SKS: ' + item?.course?.sks}  </p>
            <p className="flex xl:hidden text-xs text-gray-500">{'Peserta: ' + item.studentCount + " Mahasiswa"}</p>
          </div>
        </td>
        <td className="hidden xl:table-cell">{item?.course?.sks ?? ""}</td>
        <td className="hidden xl:table-cell">{item.semester ?? ""}</td>
        <td className="hidden xl:table-cell">
          {item?.studentCount} Mahasiswa
        </td>
      </tr >
    )
  };

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4",
    },
    {
      header: "SKS",
      accessor: "sks",
      className: "hidden xl:table-cell",
    },
    {
      header: "Semester",
      accessor: "semerster",
      className: "hidden xl:table-cell",
    },
    {
      header: "Peserta",
      accessor: "peserta",
      className: "hidden xl:table-cell",
    },
  ];

  return (
    <>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data || []} />
      {/* PAGINATION */}
      <Pagination page={page} count={count} />
    </>
  )
}

export default CourseKrs;
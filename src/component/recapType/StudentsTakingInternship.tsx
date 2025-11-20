import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/setting";
import Table from "../Table";
import Pagination from "../Pagination";
import { coursesClearing, lecturerName, totalBobot, totalSks } from "@/lib/utils";
import { AnnouncementKhs, Prisma, StudentStatus } from "@/generated/prisma/client";

type recapType = {
  periodId: string,
  page: number,
  queryParams: { [key: string]: string | undefined },
};

const StudentsTakingInternship = async (
  { periodId, page, queryParams }: recapType) => {

  const query: Prisma.StudentWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { name: { contains: value, mode: "insensitive" } },
              { nim: { contains: value, mode: "insensitive" } },
              { major: { name: { contains: value, mode: "insensitive" } } },
            ]
            break;
          case "filter":
            query.OR = [
              { major: { id: parseInt(value) } },
            ]
            break;
          default:
            break;
        }
      }
    }
  };

  const [data, count] = await prisma.$transaction(async (prisma: any) => {
    const data = await prisma.student.findMany({
      where: {
        krs: {
          some: {
            krsDetail: {
              some: {
                course: {
                  isPKL: true,
                }
              },
            }
          },
        },
        studentStatus: StudentStatus.AKTIF,
        ...query,
      },
      select: {
        name: true,
        nim: true,
        major: true,
        reregisterDetail: {
          where: {
            reregister: {
              periodId: periodId,
            }
          },
          select: {
            lecturer: {
              select: {
                name: true,
                frontTitle: true,
                backTitle: true,
              }
            },
            semester: true,
          }
        },
        khs: {
          select: {
            khsDetail: {
              where: {
                isLatest: true,
                status: AnnouncementKhs.ANNOUNCEMENT,
              },
              select: {
                course: {
                  select: {
                    id: true,
                    code: true,
                    name: true,
                    sks: true,
                    isPKL: true,
                    isSkripsi: true,
                  }
                },
                weight: true,
                gradeLetter: true,
                status: true,
              },
              orderBy: [
                { course: { name: 'asc' } }
              ]
            },
          }
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    });

    data.forEach(async (student: any) => {
      student.reregisterDetail = { ...student?.reregisterDetail[0] };
      const courses = await coursesClearing(student?.khs);
      const totalSksIntern: number = await totalSks(courses);
      const totalBobotInter: number = await totalBobot(courses);
      const gpaCalculationIntern: string = (totalBobotInter / totalSksIntern).toFixed(2);
      student.transcript = {
        totalSks: totalSksIntern,
        ipkTranscript: gpaCalculationIntern,
      };
    });

    const count = await prisma.student.count({
      where: {
        krs: {
          some: {
            krsDetail: {
              some: {
                course: {
                  isSkripsi: true,
                }
              },
            }
          },
        },
        studentStatus: StudentStatus.AKTIF,
        ...query,
      },
    });
    return [data, count];
  })

  console.log(data);


  const renderRow = (item: any) => {
    return (
      <tr
        key={item.nim}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="font-semibold">{item?.name || ""}</h3>
            <p className="text-xs font-medium text-gray-500">{item?.nim || ""}</p>
            <div className="flex gap-1 mt-1">

            </div>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
          </div>
        </td>
        <td className="hidden md:table-cell">{item?.major?.stringCode || "-"}</td>
        <td className="hidden md:table-cell">
          {lecturerName({
            frontTitle: item?.reregisterDetail?.lecturer?.frontTitle,
            name: item?.reregisterDetail?.lecturer?.name,
            backTitle: item?.reregisterDetail?.lecturer?.backTitle,
          }) ?? "-"}
        </td>
        <td className="hidden md:table-cell">{item?.transcript?.totalSks}</td>
        <td className="hidden md:table-cell">{item?.transcript?.ipkTranscript}</td>
      </tr>
    );
  }

  const columns = [
    {
      header: "Info",
      accessor: "info",
      className: "px-2 md:px-4"
    },
    {
      header: "Prodi",
      accessor: "prodi",
      className: "hidden md:table-cell",
    },
    {
      header: "Dosen Wali",
      accessor: "dosen wali",
      className: "hidden md:table-cell",
    },
    {
      header: "Total SKS",
      accessor: "sks",
      className: "hidden md:table-cell",
    },
    {
      header: "IPK",
      accessor: "ipk",
      className: "hidden md:table-cell",
    },
  ];
  return (
    <>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={page} count={count} />
    </>
  )
}

export default StudentsTakingInternship;
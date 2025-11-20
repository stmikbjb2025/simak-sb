
import FormContainer from "@/component/FormContainer";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Prisma } from "@/generated/prisma/client";
import { AssessmentDetailTypes, KhsDetailTypes, KhsGradeTypes } from "@/lib/types/datatypes/type";

const ClassSingleTabAssessmentPage = async (
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
  const user = await getSession();

  const query: Prisma.KrsDetailWhereInput = {}
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { krs: { student: { name: { contains: value, mode: "insensitive" } } } },
              { krs: { student: { nim: { contains: value, mode: "insensitive" } } } }
            ]
            break;
          default:
            break;
        }
      }
    }
  };
  const [students, assessmentDetails, count] = await prisma.$transaction(async (prisma: any) => {
    const academicClass = await prisma.academicClass.findFirst({
      where: {
        id: id,
      },
      select: {
        academicClassDetail: {
          include: {
            student: {
              select: { id: true, name: true, nim: true }
            },
          },
        },
        course: {
          include: {
            assessment: {
              include: {
                assessmentDetail: {
                  include: {
                    grade: true,
                  },
                  orderBy: {
                    seq_number: 'desc',
                  }
                },
              },
            }
          }
        }
      }
    });

    const enrolledStudents = academicClass?.academicClassDetail.map((detail: { studentId: string }) => detail.studentId) || [];
    const assessmentDetails = academicClass?.course.assessment?.assessmentDetail || [];
    const students = await prisma.khsDetail.findMany({
      where: {
        courseId: academicClass?.course?.id,
        khs: {
          student: {
            id: { in: enrolledStudents },
          },
          periodId: academicClass?.periodId,
        },
        version: {
          gte: 1,
        }
      },
      include: {
        khs: {
          include: {
            student: {
              select: { id: true, name: true, nim: true },
            },
          },
        },
        predecessor: {
          include: {
            khsGrade: {
              include: {
                assessmentDetail: {
                  include: {
                    grade: true,
                  },
                },
              },
              orderBy: {
                assessmentDetail: { seq_number: 'desc' }
              }
            },
          }
        },
        khsGrade: {
          include: {
            assessmentDetail: {
              include: {
                grade: true,
              },
            },
          },
          orderBy: {
            assessmentDetail: { seq_number: 'desc' }
          }
        },
      },
      orderBy: [
        {
          khs: {
            student: {
              nim: 'asc'
            }
          }
        }
      ]
    });

    const count = await prisma.khsDetail.count({
      where: {
        courseId: academicClass?.course?.id,
        khs: {
          student: {
            id: {
              in: enrolledStudents,
            }
          },
          periodId: academicClass?.periodId,
        },
      },
    })

    const dataTransformed = [];
    for (const items of students) {
      dataTransformed.push(
        {
          ...items,
          finalScore: parseFloat(items.finalScore),
          weight: parseFloat(items.weight),
          khs: {
            ...items.khs,
            ips: parseFloat(items.khs.ips)
          },
          predecessor: {
            ...items.predecessor,
            finalScore: parseFloat(items.predecessor.finalScore),
            weight: parseFloat(items.predecessor.weight),
          },
        },
      );
    };

    return [dataTransformed, assessmentDetails, count];
  });

  const columnPreGrade = assessmentDetails.map((item: AssessmentDetailTypes) => (
    {
      header: `${item.grade.name}`,
      accessor: `pre${item.grade.name}`,
      className: "hidden md:table-cell w-8 text-[10px] lowercase ellipsis px-2",
    }
  ));
  const columnGrade = assessmentDetails.map((item: AssessmentDetailTypes) => (
    {
      header: `${item.grade.name} (${item.percentage}%)`,
      accessor: item.grade.name,
      className: "hidden md:table-cell w-8 text-[10px] lowercase ellipsis px-2",
    }
  ));

  const columns = [
    {
      header: "Mahasiswa",
      accessor: "mahasiswa",
      className: "px-2 text-[12px]"
    },
    ...columnPreGrade,
    {
      header: 'nilai akhir',
      accessor: 'pre finalScore',
      className: "hidden md:table-cell w-8 text-[10px] lowercase px-2"
    },
    {
      header: 'abs',
      accessor: 'pre abs',
      className: "hidden md:table-cell w-8 text-[10px] lowercase px-2"
    },
    ...columnGrade,
    {
      header: 'nilai akhir',
      accessor: 'nilai akhir',
      className: "hidden md:table-cell w-8 text-[10px] lowercase px-2"
    },
    {
      header: 'abs',
      accessor: 'abs',
      className: "hidden md:table-cell w-8 text-[10px] lowercase px-2"
    },
    ...(user?.roleType === "OPERATOR"
      ? [
        {
          header: 'Actions',
          accessor: 'actions',
          className: "hidden md:table-cell text-xs"
        },
      ]
      : []),
  ];

  const renderRow = (item: KhsDetailTypes) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="text-sm font-semibold">{item.khs.student.name}</h3>
            <p className="text-xs text-gray-600">{item.khs.student.nim}</p>
            <p className="text-xs text-gray-600">{`Revisi ${item.version}`}</p>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
          </div>
        </td>
        {item?.predecessor?.khsGrade.map((preGrade: KhsGradeTypes) => (
          <td key={preGrade.id} className="hidden md:table-cell w-8 px-2 bg-accent-light text-xs font-medium">{preGrade.score || 0}</td>
        ))}
        <td className="hidden md:table-cell w-10 px-2 bg-accent-light text-xs font-medium">{item?.predecessor?.finalScore || 0}</td>
        <td className="hidden md:table-cell w-10 px-2 text-xs bg-accent-light font-medium">{item?.predecessor?.gradeLetter || "TBC"}</td>
        {item.khsGrade.map((grade: KhsGradeTypes) => (
          <td key={grade.id} className="hidden md:table-cell w-8 px-2 text-xs font-medium">{grade.score || 0}</td>
        ))}
        <td className="hidden md:table-cell w-10 px-2 text-xs font-medium">{item.finalScore || 0}</td>
        <td className="hidden md:table-cell w-10 px-2 text-xs font-medium">{item.gradeLetter || "TBC"}</td>
        {user?.roleType === "OPERATOR" && (
          <td className="hidden md:table-cell text-xs">
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <FormContainer type="update" table="khsRevision" data={item} />
                <FormContainer type="delete" table="khsGrade" id={item.id} />
              </div>
            </div>
          </td>
        )}
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:mb-6">
        <h1 className="hidden md:flex text-base font-semibold">Daftar Revisi Nilai Mata Kuliah</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
        </div>
      </div>
      {/* BOTTOM */}
      <div className="block md:hidden font-semibold text-xs my-4 py-2 px-3 bg-amber-300 rounded-md">GUNAKAN TABLET/LAPTOP UNTUK MELAKUKAN PENILAIAN!</div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={students} />
      {/* PAGINATION */}
      <Pagination page={p} count={count || 0} />
    </div>
  )
}

export default ClassSingleTabAssessmentPage;
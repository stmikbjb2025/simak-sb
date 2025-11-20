
import ButtonPdfDownload from "@/component/ButtonPdfDownload";
import FormContainer from "@/component/FormContainer";
import KhsGradeAnnounceForm from "@/component/forms/KhsGradeAnnounceForm";
import ImportForm from "@/component/ImportForm";
import Pagination from "@/component/Pagination";
import Table from "@/component/Table";
import TableSearch from "@/component/TableSearch";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { AnnouncementKhs, Prisma } from "@/generated/prisma/client";
import { AssessmentDetailTypes, KhsDetailBaseTypes, KhsGradeTypes } from "@/lib/types/datatypes/type";

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
  const [students, assessmentDetails, count, dataKhsAnnouncement] = await prisma.$transaction(async (prisma: any) => {
    const academicClass = await prisma.academicClass.findFirst({
      where: {
        id: id,
      },
      select: {
        periodId: true,
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
        isLatest: true,
      },
      include: {
        khs: {
          include: {
            student: {
              select: { id: true, name: true, nim: true },
            },
          },
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
        },
      );
    };

    const dataKhsAnnouncement = {
      course: {
        id: academicClass.course.id,
        name: academicClass.course.name,
        code: academicClass.course.code,
      },
      khsDetailId: dataTransformed.map((items: any) => items.id),
    }
    return [dataTransformed, assessmentDetails, count, dataKhsAnnouncement];
  });

  const columnGrade = assessmentDetails.map((item: AssessmentDetailTypes) => (
    {
      header: `${item.grade.name} (${item.percentage}%)`,
      accessor: item.grade.name,
      className: "hidden md:table-cell w-8 text-[10px] lowercase ellipsis",
    }
  ));

  const columns = [
    {
      header: "Mahasiswa",
      accessor: "mahasiswa",
      className: "px-2 md:px-4 text-[12px]"
    },
    ...columnGrade,
    {
      header: 'nilai akhir',
      accessor: 'nilai akhir',
      className: "hidden md:table-cell w-20 text-[10px] lowercase"
    },
    {
      header: 'abs',
      accessor: 'abs',
      className: "hidden md:table-cell w-20 text-[10px] lowercase"
    },
    {
      header: 'Keterangan',
      accessor: 'keterangan',
      className: "hidden md:table-cell text-[10px]"
    },
    {
      header: 'Actions',
      accessor: 'actions',
      className: "hidden md:table-cell text-[10px]"
    },
  ];

  const renderRow = (item: KhsDetailBaseTypes) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-4">
          <div className="flex flex-col col-span-5 items-start">
            <h3 className="text-sm font-semibold">{item.khs.student.name}</h3>
            <p className="text-xs text-gray-600">{item.khs.student.nim}</p>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
          </div>
        </td>
        {item.khsGrade.map((grade: KhsGradeTypes) => (
          <td key={grade.id} className="hidden md:table-cell w-18">{grade.score || 0}</td>
        ))}
        <td className="hidden md:table-cell w-18">{item.finalScore || 0}</td>
        <td className="hidden md:table-cell w-18 text-xs">{item.gradeLetter || "TBC"}</td>
        <td className="hidden md:table-cell text-[9px] font-bold">
          <span className={`p-1 rounded-lg ${(item.status === "DRAFT" && "text-gray-600 bg-gray-200") || (item.status === "SUBMITTED" && "text-blue-500 bg-blue-100") || (item.status === "ANNOUNCEMENT" && "text-lime-500 bg-lime-100")}`}>
            {(item.status === "DRAFT" && "DRAFT") || (item.status === "SUBMITTED" && "DISERAHKAN") || (item.status === "ANNOUNCEMENT" && "DIUMUMKAN")}
          </span>
        </td>
        <td className="hidden md:table-cell text-xs">
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              {(item.status === AnnouncementKhs.DRAFT) && (
                <FormContainer table="khsGrade" type="update" id={item.id} data={item} />
              )}
              {(item.status === AnnouncementKhs.ANNOUNCEMENT) && (
                <FormContainer table="khsRevision" type="revision" id={item.id} data={item} />
              )}
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:mb-6">
        <h1 className="hidden md:flex text-base font-semibold">Daftar Nilai Mata Kuliah</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
        </div>
      </div>
      {/* BOTTOM */}
      <div className="block md:hidden font-semibold text-xs my-4 py-2 px-3 bg-amber-300 rounded-md">GUNAKAN TABLET/LAPTOP UNTUK MELAKUKAN PENILAIAN!</div>
      {/* LIST */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:mb-6">
        {students.find((item: { status: AnnouncementKhs }) => item.status === AnnouncementKhs.DRAFT) && (
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`/api/grade?academicClassId=${id}&template=true`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium w-fit py-2 px-4 text-gray-900 bg-ternary/70 rounded-full cursor-pointer capitalize hover:bg-ternary"
            >
              Template Nilai
            </a>
            <a
              href={`/api/grade?academicClassId=${id}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium w-fit py-2 px-4 text-gray-900 bg-primary/70 rounded-full cursor-pointer hover:bg-primary"
            >
              Export .xlsx
            </a>
            <ImportForm />
          </div>
        )}
        {students.find((item: { status: AnnouncementKhs }) => item.status === AnnouncementKhs.SUBMITTED) && (
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`/api/grade?academicClassId=${id}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium w-fit py-2 px-4 text-gray-900 bg-primary/70 rounded-full cursor-pointer hover:bg-primary"
            >
              Export .xlsx
            </a>
          </div>
        )}
        {students.find((item: { status: AnnouncementKhs }) => item.status === AnnouncementKhs.ANNOUNCEMENT) && (
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`/api/grade?academicClassId=${id}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium w-fit py-2 px-4 text-gray-900 bg-primary/70 rounded-full cursor-pointer hover:bg-primary"
            >
              Export .xlsx
            </a>
            <ButtonPdfDownload id={id} type="assessment">
              <div className={`w-fit h-fit py-2 px-4 text-xs font-medium flex items-center justify-center rounded-full bg-primary/70 hover:bg-primary`}>
                Export .pdf
              </div>
            </ButtonPdfDownload>
          </div>
        )}
        {user?.roleType === "OPERATOR" && (
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col md:flex-row items-center w-full md:w-auto">
              {students.find((item: { status: AnnouncementKhs }) => item.status === AnnouncementKhs.SUBMITTED) && (
                <KhsGradeAnnounceForm type="announcement" data={dataKhsAnnouncement} />
              )}
            </div>
            <div className="flex flex-col md:flex-row items-center w-full md:w-auto">
              {students.find((item: { status: AnnouncementKhs }) => item.status === AnnouncementKhs.SUBMITTED) && (
                <KhsGradeAnnounceForm type="unsubmitted" data={dataKhsAnnouncement} />
              )}
            </div>
            <div className="flex flex-col md:flex-row items-center w-full md:w-auto">
              {students.find((item: { status: AnnouncementKhs }) => item.status === AnnouncementKhs.DRAFT) && (
                <KhsGradeAnnounceForm type="submitted" data={dataKhsAnnouncement} />
              )}
            </div>
          </div>
        )}
        {user?.roleType !== "OPERATOR" && (
          <div className="flex flex-col md:flex-row items-center w-full md:w-auto">
            {students.find((item: { status: AnnouncementKhs }) => item.status === AnnouncementKhs.DRAFT) && (
              <KhsGradeAnnounceForm type="submitted" data={dataKhsAnnouncement} />
            )}
          </div>
        )}
      </div>
      <Table columns={columns} renderRow={renderRow} data={students} />
      {/* PAGINATION */}
      <Pagination page={p} count={count || 0} />
    </div>
  )
}

export default ClassSingleTabAssessmentPage;
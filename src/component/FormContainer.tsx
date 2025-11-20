import { prisma } from "@/lib/prisma";
import FormModal from "./FormModal";
import { getSession } from "@/lib/session";
import { Course, CurriculumDetail } from "@/generated/prisma/client";
import { FormModalProps } from "@/lib/types/formtype";

const FormContainer = async (
  { table, type, label, data, id }: FormModalProps
) => {
  let relatedData = {};
  if (type !== "delete") {
    switch (table) {
      case "role":
        const rolePermission = await prisma.permission.findMany({
          select: { id: true, name: true },
        });
        relatedData = { permissions: rolePermission };
        break;
      case "course":
        const majors = await prisma.major.findMany({
          select: { id: true, name: true },
        });
        const courseData = await prisma.course.findMany({
          select: { id: true, name: true, code: true },
        });
        const assessmentType = await prisma.assessment.findMany({
          select: { id: true, name: true },
        });
        relatedData = { majors: majors, courses: courseData, assessmentType: assessmentType };
        break;
      case "operator":
        const role = await prisma.role.findMany({
          select: { id: true, name: true },
        });
        relatedData = { role: role };
        break;
      case "operatorUser":
        const roleOperatorUser = await prisma.role.findMany({
          where: { roleType: "OPERATOR" },
          select: { id: true, name: true },
        });
        relatedData = { role: roleOperatorUser };
        break;
      case "lecturer":
        const majorLecturer = await prisma.major.findMany({
          select: { id: true, name: true },
        });
        relatedData = { majors: majorLecturer };
        break;
      case "lecturerUser":
        const majorLecturerUser = await prisma.major.findMany({
          select: { id: true, name: true },
        });
        const roleLecturerUser = await prisma.role.findMany({
          where: {
            OR: [
              { roleType: "LECTURER" },
              { roleType: "ADVISOR" },
            ]
          },
          select: { id: true, name: true },
        });
        relatedData = { majors: majorLecturerUser, role: roleLecturerUser };
        break;
      case "student":
        const majorstudent = await prisma.major.findMany({
          select: { id: true, name: true },
        });
        const lecturerstudent = await prisma.lecturer.findMany({
          where: {
            user: {
              role: {
                roleType: "ADVISOR"
              }
            }
          },
          select: { id: true, name: true },
        });
        const rolestudent = await prisma.role.findMany({
          where: {
            roleType: "STUDENT",
          },
          select: { id: true, name: true },
        });
        relatedData = { majors: majorstudent, role: rolestudent, lecturer: lecturerstudent };
        break;
      case "studentUser":
        const roleStudentUser = await prisma.role.findMany({
          where: {
            roleType: "STUDENT",
          },
          select: { id: true, name: true },
        });
        relatedData = { role: roleStudentUser, };
        break;
      case "reregistration":
        const periodReregister = await prisma.period.findMany({
          select: { id: true, name: true },
          orderBy: [
            {
              year: "desc"
            },
            {
              semesterType: "asc"
            }
          ]
        });
        relatedData = { period: periodReregister };
        break;
      case "reregistrationDetail":
        const students = await prisma.student.findMany({
          include: {
            major: true,
            lecturer: true,
          },
          orderBy: [
            {
              nim: 'asc'
            }
          ],
        });
        const lecturer = await prisma.lecturer.findMany({
          where: {
            user: {
              role: {
                roleType: "ADVISOR"
              }
            }
          },
          select: { id: true, name: true, frontTitle: true, backTitle: true }
        });
        const userRole = await getSession();
        relatedData = { students: students, lecturers: lecturer, role: userRole?.roleName };
        break;
      case "reregistrationStudent":
        const student = await prisma.student.findMany({
          include: {
            major: true,
            lecturer: true,
          },
        });
        const lecturers = await prisma.lecturer.findMany({
          where: {
            user: {
              role: {
                roleType: "ADVISOR"
              }
            }
          },
          select: { id: true, name: true, frontTitle: true, backTitle: true }
        });
        relatedData = { students: student, lecturers: lecturers };
        break;
      case "curriculum":
        const majorCurriculum = await prisma.major.findMany({
          select: { id: true, name: true },
        });
        relatedData = { majors: majorCurriculum };
        break;
      case "curriculumDetail":
        const semesterInt = Array.from({ length: 8 }, (_, i) => i + 1);
        const courseCurriculumDetail = await prisma.course.findMany({
          select: { id: true, name: true, code: true, majorId: true },
        });
        relatedData = { semesterInt: semesterInt, courses: courseCurriculumDetail };
        break;
      case "assessment":
        const gradeComponents = await prisma.gradeComponent.findMany({
          select: { id: true, name: true },
        });
        relatedData = { allGradeComponent: gradeComponents };
        break;
      case "krsDetail":
        const semester = data?.semester === "GANJIL" ? [1, 3, 5, 7] : [2, 4, 6, 8];

        const courseFromCurriculum = await prisma.curriculumDetail.findMany({
          where: {
            curriculum: {
              majorId: data?.student?.majorId,
              isActive: true,
            },
            semester: {
              in: [...semester]
            }
          },
          include: {
            course: {
              include: {
                predecessor: true,
              }
            },
          },
          orderBy: [
            { semester: "asc" },
            { course: { code: "asc" } },
          ]
        })
        const dataKrsDetail = data?.krsDetail.map((item: any) => item.courseId);
        let courseFilterByKrsDetail
        if (dataKrsDetail) {
          courseFilterByKrsDetail = courseFromCurriculum.filter((item: CurriculumDetail & { course: Course }) =>
            !dataKrsDetail.includes(item.courseId)
          )
        }

        const coursePassToForm = courseFilterByKrsDetail.map(
          (item: CurriculumDetail & { course: Course & { predecessor: Course } }) => ({
            id: item.courseId,
            code: item.course.code,
            name: item.course.name,
            predecessor: item.course.predecessor,
            sks: item.course.sks,
            semester: item.semester,
          }));
        relatedData = { course: coursePassToForm };
        break;
      case "class":
        // const periodClass
        const periodClass = data?.periodId || '098';
        const semesterType = data?.periodName?.split(" ")[0] || "GANJIL";

        const semesterClass = semesterType.includes("GANJIL") ? [1, 3, 5, 7] : [2, 4, 6, 8];
        const period = await prisma.period.findMany({
          select: { id: true, name: true },
        });
        const lecturerClass = await prisma.lecturer.findMany({
          select: { id: true, name: true, frontTitle: true, backTitle: true },
        });
        const rooms = await prisma.room.findMany({
          select: { id: true, name: true },
        });

        const [dataCourseByCurriculum, dataCountcourse] = await prisma.$transaction([
          prisma.curriculumDetail.findMany({
            where: {
              curriculum: {
                isActive: true,
              },
              semester: {
                in: semesterClass,
              },
            },
            include: {
              course: {
                include: {
                  major: true,
                },
              },
              curriculum: true,
            },
            orderBy: [
              { curriculum: { major: { name: "asc" } } },
              { semester: "asc" },
              { course: { code: "asc" } }
            ],
          }),
          prisma.krsDetail.groupBy({
            by: ["courseId"],
            where: {
              krs: {
                reregister: {
                  periodId: periodClass,
                },
              },
            },
            _count: {
              courseId: true,
            },
          }),
        ]);

        const dataFilteredCourse = dataCourseByCurriculum.map((item: any) => (
          {
            id: item.course.id,
            code: item.course.code,
            major: item.course.major.name,
            name: item.course.name,
            sks: item.course.sks,
            semester: item.semester,
            participants: dataCountcourse.find((countItem: any) => countItem.courseId === item.course.id)?._count?.courseId || 0
          }
        ))

        relatedData = { period, lecturers: lecturerClass, rooms, courses: dataFilteredCourse };
        break;
      case "classDetail":
        const dataClass = data;
        const studentCourse = await prisma.krsDetail.findMany({
          where: {
            krs: {
              reregister: {
                periodId: dataClass?.periodId,
              }
            },
            courseId: dataClass?.courseId,
            isAcc: true,
          },
          include: {
            krs: {
              include: {
                reregister: true,
                student: {
                  select: {
                    id: true,
                    name: true,
                    nim: true,
                    year: true,
                  }
                },
              },
            },
          },
          orderBy: [
            {
              krs: {
                student: {
                  nim: 'asc'
                }
              }
            }
          ]
        });
        const studentList = studentCourse.map((item: any) => item.krs.student);
        const studenthaveClass = await prisma.academicClassDetail.findMany({
          where: {
            academicClass: {
              periodId: dataClass?.periodId,
              courseId: dataClass?.courseId,
            }
          },
        });
        const studenthaveClassId = new Set(studenthaveClass.map((item: any) => item.studentId))
        const studentPassToForm = studentList.filter((item: any) => !studenthaveClassId.has(item.id))

        relatedData = { students: studentPassToForm };
        break;
      case "schedule":
        const periodSchedule = await prisma.period.findMany({
          select: { id: true, name: true },
          orderBy: [
            {
              year: "desc"
            },
            {
              semesterType: "asc"
            }
          ]
        });
        relatedData = { period: periodSchedule };
        break;
      case "scheduleDetail":
        const periodScheduleDetail = await prisma.period.findMany({
          where: {
            isActive: true,
          },
          select: { id: true, name: true },
        });
        const time = await prisma.time.findMany({
          orderBy: [
            { timeStart: "asc" },
          ]
        });
        const classSchedule = await prisma.academicClass.findMany({
          where: {
            periodId: data.periodId,
          },
          include: {
            lecturer: true,
            room: true,
            course: {
              include: {
                major: true
              }
            }
          },
          orderBy: [
            {
              name: 'asc',
            },
            {
              course: {
                code: "asc"
              }
            }
          ]
        })
        const classHaveSchedule = await prisma.scheduleDetail.findMany({
          where: {
            scheduleId: data.id,
          },
        })
        const classHaveScheduleId = new Set(classHaveSchedule.map((item: any) => item.academicClassId));
        const classPassToForm = classSchedule.filter((item: any) => !classHaveScheduleId.has(item.id));

        relatedData = { period: periodScheduleDetail, time: time, academicClass: classPassToForm };
        break;
      case "rpl":
        const curriculum = await prisma.curriculumDetail.findMany({
          where: {
            curriculum: {
              isActive: true,
            },
          },
          include: {
            course: {
              include: {
                major: true,
              },
            },
            curriculum: true,
          },
          orderBy: [
            { curriculum: { major: { name: "asc" } } },
            { semester: "asc" },
          ],
        });

        const periodAcademic = await prisma.period.findFirst({
          where: {
            isActive: true,
          }
        })

        relatedData = { period: periodAcademic, courses: curriculum }
        break;
      case "khsRevision":
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <FormModal table={table} type={type} label={label} data={data} id={id} relatedData={relatedData} />
    </div>
  )
}

export default FormContainer;
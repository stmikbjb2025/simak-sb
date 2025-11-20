import { exportCourseTaken } from "@/lib/excel/exportCourseTaken";
import { exportStudentActiveInactive } from "@/lib/excel/exportStudentActiveInactive";
import { exportStudentRegisteredKrs } from "@/lib/excel/exportStudentRegisteredKrs";
import { exportStudentRegularSore } from "@/lib/excel/exportStudentRegularSore";
import { exportStudentTakingIntership } from "@/lib/excel/exportStudentTakingIntership";
import { exportStudentTakingThesis } from "@/lib/excel/exportStudentTakingThesis";
import { exportStudentUnregisteredKrs } from "@/lib/excel/exportStudentUnregisteredKrs";
import { prisma } from "@/lib/prisma";
import { coursesClearing, totalBobot, totalSks } from "@/lib/utils";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { AnnouncementKhs, Course, KrsDetail, StudentStatus } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('u');
    const type = searchParams.get('type');
  
    if (!type) {
      return new NextResponse('Terjadi Kesalahan...', { status: 400 });
    };
    if (!uid) {
      return new NextResponse('Terjadi Kesalahan...', { status: 400 });
    };

    let bufferFile;

    const dataPeriod = await prisma.period.findUnique({
      where: {
        id: uid,
      },
    });

    const dataMajor = await prisma.major.findMany({
      select: {id: true, name: true, stringCode: true}
    })

    switch (type) {
      case "coursekrs":

        const semesterQuery = dataPeriod?.semesterType === "GANJIL" ? [1, 3, 5, 7] : [2, 4, 6, 8];
        // NEW
        const years = new Set();
        const report = await prisma.curriculumDetail.findMany({
          where: {
            semester: { in: semesterQuery },
            curriculum: {
              isActive: true,
            },
          },
          select: {
            course: {
              select: {
                id: true,
                code: true,
                name: true,
                majorId: true,
              },
            },
            semester: true,
          },
          orderBy: [
            { course: { majorId: "asc" } },
            { semester: "asc" },
          ],
        });
        report.forEach((element: any) => {
          element.BJB = 0;
          element.BJM = 0;
          element.ONLINE = 0;
          element.SORE = 0;
          element.angkatan = {};
          element.totalStudents = 0;
        });
        const coursesInStudyPlan = await prisma.krsDetail.findMany({
          where: {
            krs: {
              reregister: {
                periodId: uid,
              }
            }
          },
          select: {
            courseId: true,
            krs: {
              select: {
                student: {
                  select: {
                    year: true,
                  }
                },
                reregisterDetail: {
                  select: {
                    campusType: true,
                  }
                }
              }
            }
          }
        });

        coursesInStudyPlan.forEach((course: any) => {
          const currentCourse = report.find((item: any) => item.course.id === course.courseId);

          if (course?.krs?.reregisterDetail?.campusType === "BJB") currentCourse.BJB++;
          if (course?.krs?.reregisterDetail?.campusType === "BJM") currentCourse.BJM++;
          if (course?.krs?.reregisterDetail?.campusType === "ONLINE") currentCourse.ONLINE++;
          if (course?.krs?.reregisterDetail?.campusType === "SORE") currentCourse.SORE++;
          if (course?.krs?.student?.year) {
            years.add(course?.krs?.student?.year);
            if (!currentCourse.angkatan[course?.krs?.student?.year]) {
              currentCourse.angkatan[course?.krs?.student?.year] = 0;
            }
            currentCourse.angkatan[course?.krs?.student?.year]++;
          }
          currentCourse.totalStudents++;
        });
  
        const finalReport = report.map((items: any) => {
          const yearArray = Array.from(years) as number[];
          const yearCounts = yearArray.sort().reduce<Record<string, number>>((acc, year) => {
            acc[year] = items.angkatan[year] || 0;
            return acc;
          }, {});
          const row = {
            "code": items.course.code,
            "name": items.course.name,
            "semester": items.semester,
            "majorId": items.course.majorId,
            "BJB": items.BJB,
            "BJM": items.BJM,
            "ONLINE": items.ONLINE,
            "SORE": items.SORE,
            ...yearCounts,
            totalStudents: items.totalStudents,
          };
          return row;
        })

        const dataCoursesByMajor = dataMajor.map((major: any) => {
          const course = finalReport.filter((course: any) => course?.majorId === major.id)
          return { major: major, courses: course }
        })
        
        bufferFile = await exportCourseTaken({
          data: {
            dataPeriod,
            dataCoursesByMajor: dataCoursesByMajor,
            years: Array.from(years).sort() as number[],
          }
        })
        return new NextResponse(bufferFile, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="REKAPITULASI MATA KULIAH (${dataPeriod?.name}).xlsx"`,
          },
        });
      case "studentsRegisteredKrs":
        const studentRegisteredKrs = await prisma.krs.findMany({
          where: {
            reregister: {
              periodId: uid,
            },
            krsDetail: {
              some: {},
            },
          },
          select: {
            student: {
              select: {
                nim: true,
                name: true,
                major: true,
              }
            },
            maxSks: true,
            ips: true,
            lecturer: {
              select: {
                name: true,
              }
            },
            isStatusForm: true,
            reregisterDetail: {
              select: {
                semester: true,
                lecturer: {
                  select: {
                    name: true,
                  }
                }
              }
            },
            krsDetail: {
              select: {
                course: {
                  select: {
                    sks: true,
                  }
                }
              }
            },
          },
          orderBy: [
            {
              student: {
                nim: "desc"
              },
            },
          ],
        });
        studentRegisteredKrs.forEach((element: any) => {
          element.ips = Number(element.ips).toFixed(2);
          const totalSks = element.krsDetail.map((item: KrsDetail & { course: Course }) => item.course.sks).reduce((acc: number, init: number) => acc + init, 0);
          element.totalSksTaken = totalSks;
        });
        
        const dataStudentRegisteredKrs = dataMajor.map((major: any) => {
          const studentsRegisteredkrs = studentRegisteredKrs.filter((student: any) => student?.student?.major?.id === major?.id)
          return { major: major, students: studentsRegisteredkrs }
        })
        
        bufferFile = await exportStudentRegisteredKrs({
          data: {
            dataPeriod: dataPeriod,
            dataStudentByMajor: dataStudentRegisteredKrs,
          }
        })
        return new NextResponse(bufferFile, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="REKAP MAHASISWA SUDAH KRS (${dataPeriod?.name}).xlsx"`,
          },
        });
      case "studentsUnregisteredKrs":
        const studentUnregisteredKrs = await prisma.krs.findMany({
          where: {
            reregister: {
              periodId: uid,
            },
            krsDetail: {
              none: {},
            },
          },
          select: {
            student: {
              select: {
                nim: true,
                name: true,
                major: true,
              }
            },
            ips: true,
            lecturer: {
              select: {
                name: true,
              }
            },
            reregisterDetail: {
              select: {
                semester: true,
                lecturer: {
                  select: {
                    name: true,
                  }
                }
              }
            }
          },
          orderBy: [
            {
              student: {
                nim: "desc"
              },
            },
          ],
        });
        studentUnregisteredKrs.forEach((element: any) => {
          element.ips = Number(element.ips).toFixed(2);
        });

        const dataStudentUnregisteredKrs = dataMajor.map((major: any) => {
          const studentsUnregisteredkrs = studentUnregisteredKrs.filter((student: any) => student?.student?.major?.id === major?.id)
          return { major: major, students: studentsUnregisteredkrs }
        })
        
        bufferFile = await exportStudentUnregisteredKrs({
          data: {
            dataPeriod: dataPeriod,
            dataStudentByMajor: dataStudentUnregisteredKrs,
          }
        })
        return new NextResponse(bufferFile, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="REKAP MAHASISWA BELUM KRS (${dataPeriod?.name}).xlsx"`,
          },
        });
      case "studentsTakingThesis":
        const [studentsTakingThesis] = await prisma.$transaction(async (prisma:any) => {
          const studentsTakingThesis = await prisma.student.findMany({
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
            },
            select: {
              name: true,
              nim: true,
              major: true,
              reregisterDetail: {
                where: {
                  reregister: {
                    periodId: uid,
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
              _count: {
                select: {
                  krs: {
                    where: {
                      krsDetail: {
                        some: {
                          course: {
                            isSkripsi: true,
                          }
                        }
                      }
                    },
                  },
                }
              }
            },
          });
          studentsTakingThesis.forEach(async (student: any) => {
            student.reregisterDetail = { ...student?.reregisterDetail[0] };
            const coursesThesis = await coursesClearing(student?.khs);
            const totalSksThesis: number = await totalSks(coursesThesis);
            const totalBobotThesis: number = await totalBobot(coursesThesis);
            const gpaCalculationThesis = (totalBobotThesis / totalSksThesis).toFixed(2);

            student.transcript = {
              totalSks: totalSksThesis,
              ipkTranscript: gpaCalculationThesis,
            };
          });
          
          return [studentsTakingThesis];
        });
        
        bufferFile = await exportStudentTakingThesis({
          data: {
            dataPeriod: dataPeriod,
            dataStudent: studentsTakingThesis,
          }
        })
        return new NextResponse(bufferFile, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="REKAP MAHASISWA PROGRAM TA (${dataPeriod?.name}).xlsx"`,
          },
        });
      case "studentsTakingInternship":
        const [studentsTakingInternship] = await prisma.$transaction(async (prisma: any) => {
          const studentsTakingInternship = await prisma.student.findMany({
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
            },
            select: {
              name: true,
              nim: true,
              major: true,
              reregisterDetail: {
                where: {
                  reregister: {
                    periodId: uid,
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
          });
      
          studentsTakingInternship.forEach(async (student: any) => {
            student.reregisterDetail = { ...student?.reregisterDetail[0] };
            const courses = await coursesClearing(student?.khs);
            const totalSksIntern: number = await totalSks(courses);
            const totalBobotIntern: number = await totalBobot(courses);
            const gpaCalculationIntern = (totalBobotIntern / totalSksIntern).toFixed(2);

            student.transcript = {
              totalSks: totalSksIntern,
              ipkTranscript: gpaCalculationIntern,
            };
          });

          return [studentsTakingInternship];
        });
        const dataStudentsTakingInternship = dataMajor.map((major: any) => {
          const studentsTakinginternship = studentsTakingInternship.filter((student: any) => student?.major?.id === major?.id)
          return {major: major, students: studentsTakinginternship}
        })
        
        bufferFile = await exportStudentTakingIntership({
          data: {
            dataPeriod: dataPeriod,
            dataStudentByMajor: dataStudentsTakingInternship,
          }
        })
        return new NextResponse(bufferFile, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="DAFTAR MAHASISWA PROGRAM PKL (${dataPeriod?.name}).xlsx"`,
          },
        });
      case "studentActiveInactive":
        const studentsActiveInactive = await await prisma.reregisterDetail.findMany({
                where: {
                  reregister: {
                    periodId: uid,
                  },
                },
                select: {
                  student: {
                    select: {
                      nim: true,
                      name: true,
                      major: true,
                    }
                  },
                  semesterStatus: true,
                },
              });

        const dataStudentsActiveInactive = dataMajor.map((major: any) => {
          const studentsActiveinactive = studentsActiveInactive.filter((student: any) => student?.student?.major?.id === major?.id)
          return {major: major, students: studentsActiveinactive}
        })
        
        bufferFile = await exportStudentActiveInactive({
          data: {
            dataPeriod: dataPeriod,
            dataStudentByMajor: dataStudentsActiveInactive,
          }
        })
        return new NextResponse(bufferFile, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="DAFTAR MAHASISWA AKTIF-NONAKTIF (${dataPeriod?.name}).xlsx"`,
          },
        });
      case "studentsRegularSore":
        const studentsRegularSore = await await prisma.reregisterDetail.findMany({
          where: {
            reregister: {
              periodId: uid,
            },
            campusType: "SORE"
          },
          select: {
            student: {
              select: {
                nim: true,
                name: true,
                major: true,
              }
            },
            campusType: true,
          },
          orderBy: [
            { student: { nim: "desc" } },
          ]
        });
        const studentsRegularPagi = await await prisma.reregisterDetail.findMany({
          where: {
            reregister: {
              periodId: uid,
            },
            campusType: {in: ["BJM", "BJB", "ONLINE"]}
          },
          select: {
            student: {
              select: {
                nim: true,
                name: true,
                major: true,
              }
            },
            campusType: true,
          },
          orderBy: [
            { student: { nim: "desc" } },
          ]
        });

        const dataStudents = [
          {
            campusType: "SORE",
            students: studentsRegularSore,
          },
          {
            campusType: "PAGI",
            students: studentsRegularPagi,
          },
        ];
        
        bufferFile = await exportStudentRegularSore({
          data: {
            dataPeriod: dataPeriod,
            dataStudents: dataStudents,
          }
        })
        return new NextResponse(bufferFile, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="DAFTAR MAHASISWA Reg.Pagi-Sore (${dataPeriod?.name}).xlsx"`,
          },
        });
      default:
        return new NextResponse('Someting wrong!', { status: 400 });
    }
  } catch (err) {
    error(err);
    return new NextResponse('Someting wrong!', { status: 400 });
  }
  
}
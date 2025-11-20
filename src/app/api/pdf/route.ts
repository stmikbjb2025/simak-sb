import { prisma } from "@/lib/prisma";
import renderPdf from "@/lib/renderPdf";
import { courseSorting, lecturerName, totalBobot, totalSks } from "@/lib/utils";
import { format } from "date-fns";
import { id as indonesianLocale, } from "date-fns/locale";
import { NextRequest, NextResponse } from "next/server";
import { AnnouncementKhs } from "@/generated/prisma/enums";
import { Course, KrsDetail } from "@/generated/prisma/client";
import logger from "@/lib/logger";
import path from "path";
import { readFile } from "fs/promises";
import { AppError } from "@/lib/errors/appErrors";

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
    let bufferUint8Array;
    const date = format(new Date(), 'dd MMMM yyyy', { locale: indonesianLocale });
    const dataPeriod = await prisma.period.findUnique({
      where: {
        id: uid,
      },
    });

    const dataMajor = await prisma.major.findMany({
      select: {id: true, name: true, stringCode: true}
    })
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    const logoFile = await readFile(logoPath)

    if (!logoFile) {
      throw new AppError("Gagal membaca file logo .png", 400);
    }

    const mimeType = 'image/png';
    
    const img: string = `data:${mimeType};base64,${logoFile.toString('base64')}`;

    switch (type) {
      case "assessment":
        const academicClass = await prisma.academicClass.findUnique({
          where: { id: uid },
          select: {
            id: true,
            name: true,
            course: {
              select: {
                id: true,
                name: true,
                code: true,
                major: {
                  select: {
                    name: true,
                  },
                },
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
                },
              },
            },
            lecturer: {
              select: {
                name: true,
                frontTitle: true,
                backTitle: true,
              }
            },
            period: {
              select: {
                id: true,
                name: true,
              }
            },
            academicClassDetail: true,
          },
        });
        const assessmentDetail = academicClass?.course?.assessment?.assessmentDetail || [];
        const khsDetails = await prisma.khsDetail.findMany({
          where: {
            courseId: academicClass?.course?.id,
            khs: {
              student: {
                id: {
                  in: academicClass?.academicClassDetail.map((detail: any) => detail.studentId) || [],
                }
              },
              periodId: academicClass?.period?.id,
            },
          },
          include: {
            khs: {
              include: {
                student: {
                  select: { id: true, name: true, nim: true }
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
              },
            },
          },
          orderBy: [
            { khs: { student: { nim: 'asc' } } }
          ]
        });
        const lecturername = await lecturerName({
          frontTitle: academicClass?.lecturer?.frontTitle,
          name: academicClass?.lecturer?.name,
          backTitle: academicClass?.lecturer?.backTitle,
        });
        
        bufferFile = await renderPdf({
          type: type,
          data: {
            assessmentDetail,
            khsDetails,
            academicClass: {
              ...academicClass,
              lecturername: lecturername,
            },
            img: img,
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile)
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=DAFTAR NILAI (${academicClass?.course?.code}) ${academicClass?.course?.name} - KELAS ${academicClass?.name}.pdf`,
          },
        });
      case "krs":
        const krsStudent = await prisma.krs.findUnique({
          where: {
            id: uid,
          },
          select: {
            student: {
              select: {
                id: true,
                name: true,
                nim: true,
                major: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            reregister: {
              select: {
                id: true,
                period: {
                  select: {
                    id: true,
                    name: true,
                    semesterType: true,
                  },
                },
              },
            },
            maxSks: true,
            ips: true,
            lecturer: {
              select: {
                name: true,
                frontTitle: true,
                backTitle: true,
              },
            },
            krsDetail: {
              select: {
                course: {
                  select: {
                    id: true,
                    name: true,
                    sks: true,
                    code: true,
                  },
                },
                isAcc: true,
              },
            },
          },
        });
        const reregistrasiStudent = await prisma.reregisterDetail.findUnique({
          where: {
            reregisterId_studentId: {
              reregisterId: krsStudent?.reregister?.id,
              studentId: krsStudent.student?.id,
            },
          },
        });
        const lecturerNameKrs = await lecturerName({
          frontTitle: krsStudent?.lecturer?.frontTitle,
          name: krsStudent?.lecturer?.name,
          backTitle: krsStudent?.lecturer?.backTitle,
        });

        bufferFile = await renderPdf({
          type: type,
          data: {
            krsStudent: {
              ...krsStudent,
              ips: Number(krsStudent?.ips) || 0,
            },
            lecturerNameKrs,
            semester: reregistrasiStudent?.semester,
            img: img,
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile);
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${krsStudent?.student?.nim}(KRS-${krsStudent?.reregister?.period?.name}).pdf`,
          },
        });
      case "khs":
        const khsStudent = await prisma.khs.findUnique({
          where: {
            id: uid,
          },
          select: {
            student: {
              select: {
                id: true,
                name: true,
                nim: true,
                major: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            semester: true,
            period: {
              select: {
                name: true,
                semesterType: true,
              },
            },
            ips: true,
            maxSks: true,
          }
        });
        const queryPosition = khsStudent?.student?.major?.name.toLowerCase() === "sistem informasi" ? "KAPRODI SI" : "KAPRODI TI";
        const position = await prisma.position.findFirst({
          where: {
            positionName: {
              contains: queryPosition,
              mode: 'insensitive'
            },
          },
        });
        const khsDetail = await prisma.khsDetail.findMany({
          where: {
            khsId: uid,
            isLatest: true,
          },
          select: {
            course: {
              select: {
                code: true,
                name: true,
                sks: true,
              }
            },
            gradeLetter: true,
            weight: true,
          },
        });
        const totalSKS = khsDetail?.map((item: any) => item.course.sks)
          .reduce((acc: any, init: any) => acc + init, 0)
        const totalSKSxNAB = khsDetail?.map((item: any) => item.course.sks * item.weight)
          .reduce((acc: any, init: any) => acc + init, 0)
        
        bufferFile = await renderPdf({
          type: type,
          data: {
            khsStudent: {
              ...khsStudent,
              ips: Number(khsStudent?.ips) || 0,
            },
            khsDetail,
            totalSKS,
            totalSKSxNAB,
            position,
            img: img,
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile);
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${khsStudent?.student?.nim}(KHS-${khsStudent?.period?.name}).pdf`,
          },
        });
      case "transcript":
        const [dataStudent, coursesFinal, coursesUnfinishSorted, totalSKSTranscript, totalSKSUnfinish, totalBobotTranscript, gpaCalculationTranscript] = await prisma.$transaction(async (prisma: any) => {
          const data = await prisma.student.findUnique({
            where: {
              id: uid,
            },
            select: {
              name: true,
              nim: true,
              khs: {
                orderBy: [
                  { semester: 'desc' }
                ],
                select: {
                  semester: true,
                  khsDetail: {
                    where: {
                      isLatest: true,
                      course: {
                        isSkripsi: false,
                      },
                      status: AnnouncementKhs.ANNOUNCEMENT,
                    },
                    select: {
                      course: {
                        select: {
                          id: true,
                          code: true,
                          name: true,
                          sks: true,
                          courseType: true,
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
                  }
                }
              }
            },
          });

          // get course from curriculum detail
          const courseCurriculum = await prisma.curriculum.findFirst({
            where: {
              curriculumDetail: {
                some: {
                  courseId: {
                    in: data?.khs?.flatMap((khsItem: any) => khsItem.khsDetail.map((detail: any) => detail.course.id)) || [],
                  }
                }
              }
            },
            select: {
              name: true,
              major: true,
              curriculumDetail: {
                select: {
                  semester: true,
                  courseId: true,
                  course: {
                    select: {
                      id: true,
                      code: true,
                      name: true,
                      sks: true,
                      courseType: true,
                      isPKL: true,
                      isSkripsi: true,
                      predecessor: {
                        select: {
                          id: true,
                          name: true,
                          code: true,
                          sks: true,
                        }
                      },
                      successor: {
                        select: {
                          id: true,
                          name: true,
                          code: true,
                          sks: true,
                        }
                      },
                    },
                  },
                },
                distinct: ['courseId'],
              },
            }
          });
          
        
          const dataStudent = {
            name: data?.name,
            nim: data?.nim,
          };
          
          let coursesFinish: any = {};
          let coursekonsentrasi: number = 0;
          for (const khs of data?.khs) {
            khs?.khsDetail.forEach((detail: any) => {
              const courseInCurriculum = courseCurriculum?.curriculumDetail
                .find((courseDetail: any) => courseDetail.courseId === detail.course.id || courseDetail?.course?.predecessor?.id === detail.course.id || courseDetail?.course?.successor?.id === detail.course.id);
              if (courseInCurriculum) {
                courseInCurriculum.course?.courseType === "PILIHAN_KONSENTRASI" ? coursekonsentrasi += courseInCurriculum.course?.sks : null;
                const idMK = courseInCurriculum?.course?.id;
                detail.weight = Number(detail.weight);
                if (!coursesFinish[idMK]) {
                  coursesFinish[idMK] = {
                    course: courseInCurriculum.course,
                    weight: detail.weight,
                    gradeLetter: detail.gradeLetter,
                  };
                }
                // deleteCourseInCurriculum =
                courseCurriculum?.curriculumDetail.splice(courseCurriculum?.curriculumDetail.indexOf(courseInCurriculum), 1);
              }
            });
          };
          coursesFinish = Object.values(coursesFinish)
          

          // Menghitung course pilihan konsentrasi
          // 1. delete CourseCurriculum that courseType is PILIHAN_KONSENTRASI
          const coursesUnfinish = courseCurriculum?.curriculumDetail.filter((courseDetail: any) => courseDetail.course?.courseType !== "PILIHAN_KONSENTRASI");
          
          // 2. tambahkan jika coursekonsentrasi kurang dari 9 sks
          const count: number = (coursekonsentrasi / 3 === 0 && 3) || (coursekonsentrasi / 3 === 1 && 2) || (coursekonsentrasi / 3 === 2 && 1) || 0;
          for (let i = 0; i < count; i++) {
            coursesUnfinish.push({
              semester: null,
              courseId: `${i}`,
              course: {
                id: `${i}`,
                code: "",
                name: "PILIHAN",
                sks: 3,
              },
            })
          }
          
          const coursesUnfinishSorted = await courseSorting(coursesUnfinish);
          const coursesFinishSorted = await courseSorting(coursesFinish);
          
          const courseIsnPkl = coursesFinishSorted.filter((item: any) => item.course.isPKL === false);
          const courseIsPkl = coursesFinishSorted.filter((item: any) => item.course.isPKL);
          
          const coursesFinal = [...courseIsnPkl, ...courseIsPkl];

          const totalSKSTranscript = await totalSks(coursesFinishSorted);
          const totalSKSUnfinish = await totalSks(coursesUnfinishSorted);
          const totalBobotTranscript = await totalBobot(coursesFinishSorted);

          const gpaCalculationTranscript = (totalBobotTranscript / totalSKSTranscript).toFixed(2);
          
          return [dataStudent, coursesFinal, coursesUnfinishSorted, totalSKSTranscript,totalSKSUnfinish, totalBobotTranscript, gpaCalculationTranscript];
        })
        
        bufferFile = await renderPdf({
          type: type,
          data: {
            dataStudent,
            coursesFinal,
            coursesUnfinishSorted,
            totalSKSTranscript,
            totalSKSUnfinish,
            totalBobotTranscript,
            gpaCalculationTranscript,
            img: img,
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan. File Buffer gagal dibuat...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile);
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${dataStudent?.nim}(TRANSCRIPT).pdf`,
          },
        });
      case "reregister":
        const [reregisterId, studentId] = uid.split(':');
        const reregister = await prisma.reregisterDetail.findUnique({
          where: {
            reregisterId_studentId: {
              reregisterId: reregisterId,
              studentId: studentId,
            },
          },
          select: {
            semester: true,
            campusType: true,
            reregister: {
              select: {
                period: {
                  select: {
                    name: true,
                    semesterType: true,
                    year: true,
                  }
                }
              },
            },
            student: {
              select: {
                nim: true,
                name: true,
                major: {
                  select: { name: true }
                },
                placeOfBirth: true,
                birthday: true,
                address: true,
                domicile: true,
                email: true,
                hp: true,
                guardianName: true,
                guardianNIK: true,
                guardianHp: true,
                guardianJob: true,
                guardianAddress: true,
                motherName: true,
                motherNIK: true,
              },
            }
          },
        });
        bufferFile = await renderPdf({
          type: type,
          data: {
            reregister: {
              ...reregister,
              student: {
                ...reregister?.student,
                birthday: reregister?.student?.birthday ? format(reregister.student.birthday, 'dd/MM/yyyy') : '',
              },
              campusType: (reregister?.campusType === "BJB" && 'BANJARBARU') || (reregister?.campusType === "BJM" && 'BANJARMASIN') || reregister?.campusType,
            },
            img: img,
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile);
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${reregister?.student?.nim}(HERREGISTRASI-${reregister?.reregister?.period?.name}).pdf`,
          },
        });
      case "coursekrs":
        const semesterQuery = dataPeriod?.semesterType === "GANJIL" ? [1, 3, 5, 7] : [2, 4, 6, 8];
        const coursesInCurriculumDetail = await prisma.curriculumDetail.findMany({
          where: {
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
        });
      
        const countCourseInKrsDetail = await prisma.krsDetail.count({
          where: {
            krs: {
              reregister: {
                period: {
                  id: uid,
                }
              }
            }
          }
        });
        let countCourseTaken = [];
        if (countCourseInKrsDetail >= 1) {
          countCourseTaken = await prisma.krsDetail.groupBy({
            by: ["courseId"],
            where: {
              krs: {
                reregister: {
                  period: {
                    id: uid,
                  },
                },
              },
            },
            _count: {
              courseId: true,
            },
          });
        };
      
        const dataFinal = coursesInCurriculumDetail.map((item: any) => {
          return {
            ...item,
            studentCount: countCourseTaken.find((items: any) => item.courseId === items.courseId)?._count?.courseId || 0,
          };
        });
        const dataCoursesByMajor = dataMajor.map((major: any) => {
          const course = dataFinal.filter((course: any) => course?.course?.majorId === major.id)
          return {major: major, courses: course}
        })

        bufferFile = await renderPdf({
          type: type,
          data: {
            dataPeriod,
            dataCoursesByMajor,
            date,
            img: img,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile);
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=REKAPITULASI MATA KULIAH (${dataPeriod?.name}).pdf`,
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
          return {major: major, students: studentsRegisteredkrs}
        })

        bufferFile = await renderPdf({
          type: type,
          data: {
            dataPeriod,
            dataStudentRegisteredKrs,
            img: img,
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile);
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=REKAP MAHASISWA SUDAH KRS (${dataPeriod?.name}).pdf`,
          },
        });
      case "studentsUnregisteredKrs":
        const studentsUnregisteredKrs = await prisma.krs.findMany({
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
          },
        });

        const dataStudentsUnregisteredKrs = dataMajor.map((major: any) => {
          const studentsUnregisteredkrs = studentsUnregisteredKrs.filter((student: any) => student?.student?.major?.id === major?.id)
          return {major: major, students: studentsUnregisteredkrs}
        })

        bufferFile = await renderPdf({
          type: type,
          data: {
            dataPeriod,
            dataStudentsUnregisteredKrs,
            img: img,
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile);
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=REKAP MAHASISWA BELUM KRS (${dataPeriod?.name}).pdf`,
          },
        });
      case "studentsTakingThesis":
        const studentsTakingThesis = await prisma.krs.findMany({
          where: {
            reregister: {
              periodId: uid,
            },
            krsDetail: {
              some: {
                course: {
                isSkripsi: true,
                },
              },
            },
          },
          select: {
            student: {
              select: {
                nim: true,
                name: true,
                major: true,
              }
            }
          },
        });

        const dataStudentsTakingThesis = dataMajor.map((major: any) => {
          const studentsTakingthesis = studentsTakingThesis.filter((student: any) => student?.student?.major?.id === major?.id)
          return {major: major, students: studentsTakingthesis}
        })

        bufferFile = await renderPdf({
          type: type,
          data: {
            dataPeriod,
            dataStudentsTakingThesis,
            img: img,
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile);
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=REKAP MAHASISWA PROGRAM TA (${dataPeriod?.name}).pdf`,
          },
        });
      case "studentsTakingInternship":
        const studentsTakingInternship = await prisma.krs.findMany({
          where: {
            reregister: {
              periodId: uid,
            },
            krsDetail: {
              some: {
                course: {
                  isPKL: true,
                },
              },
            },
          },
          select: {
            student: {
              select: {
                nim: true,
                name: true,
                major: true,
              }
            }
          },
        });

        const dataStudentsTakingInternship = dataMajor.map((major: any) => {
          const studentsTakinginternship = studentsTakingInternship.filter((student: any) => student?.student?.major?.id === major?.id)
          return {major: major, students: studentsTakinginternship}
        })

        bufferFile = await renderPdf({
          type: type,
          data: {
            dataPeriod,
            dataStudentsTakingInternship,
            img: img,
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile);
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=REKAP MAHASISWA PROGRAM PKL (${dataPeriod?.name}).pdf`,
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
          orderBy: [
          { semesterStatus: "asc" }
        ],
        });

        const dataStudentsActiveInactive = dataMajor.map((major: any) => {
          const studentsActiveinactive = studentsActiveInactive.filter((student: any) => student?.student?.major?.id === major?.id)
          return {major: major, students: studentsActiveinactive}
        })

        bufferFile = await renderPdf({
          type: type,
          data: {
            dataPeriod,
            dataStudentsActiveInactive,
            img: img,
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile);
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=REKAP MAHASISWA AKTIF-NONAKTIF (${dataPeriod?.name}).pdf`,
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

        bufferFile = await renderPdf({
          type: type,
          data: {
            dataPeriod,
            dataStudents,
            img: img,
            date,
          }
        })
        if (!bufferFile) {
          return new NextResponse('Terjadi Kesalahan...', { status: 400 });
        }
        bufferUint8Array = new Uint8Array(bufferFile);
        return new NextResponse(bufferUint8Array, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=REKAP MAHASISWA Reg.Pagi-Sore (${dataPeriod?.name}).pdf`,
          },
        });
      default:
        break;
    }
  } catch (err) {
    logger.error(err)
    return new NextResponse('Someting wrong!', { status: 400 });
  }
  
}
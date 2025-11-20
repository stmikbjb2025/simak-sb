import { exportAssessmentGrade } from "@/lib/excel/exportAssessmentGrade";
import { exportAssessmentTemplate } from "@/lib/excel/exportAssessmentTemplate";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const academicClassId = searchParams.get('academicClassId');
    const template = searchParams.get('template');
  
    if (!academicClassId) {
      return new NextResponse('Missing Params', { status: 400 });
    };
    const academicClass = await prisma.academicClass.findUnique({
      where: { id: academicClassId },
      select: {
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
            },
            major: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        academicClassDetail: true,
        lecturer: {
          select: {
            id: true,
            name: true,
          },
        },
        name: true,
        periodId: true,
        period: {
          select: {
            name: true,
          }
        }
      },
    });
    
    const khsDetails = await prisma.khsDetail.findMany({
      where: {
        courseId: academicClass?.course?.id,
        khs: {
          student: {
            id: {
              in: academicClass?.academicClassDetail.map((detail: any) => detail.studentId) || [],
            }
          },
          periodId: academicClass?.periodId,
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
        {khs: {student: {nim: 'asc'}}}
      ]
    });

    const data = { academicClass, khsDetails };
    const bufferFile = template ? await exportAssessmentTemplate(data) : await exportAssessmentGrade(data);
    return new NextResponse(bufferFile, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Kelas ${academicClass?.name} - (${academicClass?.course?.code}) ${academicClass?.course?.name} - ${academicClass?.period?.name}.xlsx"`,
      },
    });
  } catch (err) {
    logger.error(err)
    return new NextResponse('Someting wrong!', { status: 400 });
  }
  
}
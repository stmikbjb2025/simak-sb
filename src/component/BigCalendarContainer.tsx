import { prisma } from "@/lib/prisma";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";
import BigCalendar from "./BigCalendar";
import { Prisma } from "@/generated/prisma/client";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "lecturerId" | "studentId";
  id: string;
}) => {

  const query: Prisma.ScheduleDetailWhereInput = {};
  switch (type) {
    case "lecturerId":
      query.academicClass = {
        lecturerId: id.toString(),
      };
      break;
    case "studentId":
      query.academicClass = {
        academicClassDetail: {
          some: {
            studentId: id,
          },
        },
      };
      break;

    default:
      break;
  }
  const dataRes = await prisma.scheduleDetail.findMany({
    where: query,
    select: {
      academicClass: {
        select: {
          name: true,
          course: {
            select: {
              name: true,
              code: true,
            },
          },
          room: true,
          lecturerId: true,
          lecturer: true,
        }
      },
      time: true,
      dayName: true,
    },
    orderBy: [
      {
        time: {
          timeStart: "asc",
        },
      },
    ]
  });


  const data = dataRes.map((lesson: any) => ({
    title: `Kelas ${lesson.academicClass.name} | (${lesson.academicClass.course.code}) ${lesson.academicClass.course.name}`,
    start: lesson.time.timeStart,
    end: lesson.time.timeFinish,
    dayName: lesson.dayName,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="h-[1000px]">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;

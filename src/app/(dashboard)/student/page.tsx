import Announcements from "@/component/Announcements";
import BigCalendarContainer from "@/component/BigCalendarContainer";
import { redirectDashboardByRole } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const StudentPage = async () => {
  const dashboardByRole = await redirectDashboardByRole();
  if (dashboardByRole !== "student") {
    return redirect("/" + dashboardByRole);
  }
  const getSessionfunc = await getSession();
  const data = await prisma.student.findUnique({
    where: {
      userId: getSessionfunc?.userId,
    },
    select: {
      id: true,
    }
  })
  return (
    <div className="p-4 flex flex-col lg:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full lg:w-3/4 flex flex-col gap-8">
        <div className="mt-4 bg-white rounded-md p-4 min-h-fit">
          <h1>Jadwal Perkuliahan</h1>
          <BigCalendarContainer type="studentId" id={data?.id as string} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/4 flex flex-col gap-8">
        {/* <EventCalender /> */}
        <Announcements />
      </div>
    </div >
  )
}

export default StudentPage;
import Image from "next/image";
import CountChart from "./CountChart";
import { prisma } from "@/lib/prisma";

interface CountChartContainerProps {
  type: "studentsByGender" | "studentsBymajors";
  title: string;
}

const CountChartContainer = async ({ type, title }: CountChartContainerProps) => {
  let valueA: number = 0;
  let valueB: number = 0;
  const legendTitle: Record<typeof type, string[]> = {
    studentsByGender: ["Boys", "Girls"],
    studentsBymajors: ["S.Informasi", "T.Informatika"],
  }

  switch (type) {
    case "studentsByGender":
      const queryStudents = await prisma.student.groupBy({
        by: ["gender"],
        _count: true,
      });
      valueA = queryStudents.find((d: any) => d.gender === "PRIA")?._count || 0;
      valueB = queryStudents.find((d: any) => d.gender === "WANITA")?._count || 0;
      break;
    case "studentsBymajors":
      const major = await prisma.major.findMany({
        include: {
          _count: {
            select: { student: true },
          }
        }
      });
      valueA = major[0]?._count?.student || 0;
      valueB = major[1]?._count?.student || 0;
      break;
    default:
      break;
  }

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">{title}</h1>
        <Image src={"/moreDark.png"} alt="more-icon" width={20} height={20} className="" />
      </div>
      {/* CHART */}
      <CountChart valueA={valueA} valueB={valueB} />
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="bg-ternary rounded-full w-5 h-5" />
          <h1 className="font-bold">{valueA}</h1>
          <h2 className="text-xs text-gray-400">{legendTitle[type][0]} ({Math.round((valueA / (valueA + valueB)) * 100)}%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="bg-secondary rounded-full w-5 h-5" />
          <h1 className="font-bold">{valueB}</h1>
          <h2 className="text-xs text-gray-400">{legendTitle[type][1]} ({Math.round((valueA / (valueA + valueB)) * 100)}%)</h2>
        </div>
      </div>
    </div>
  )
}

export default CountChartContainer;
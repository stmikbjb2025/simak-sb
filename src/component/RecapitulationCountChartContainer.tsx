import Image from "next/image";
import CountChart from "./CountChart";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ReregisterDetail } from "@/generated/prisma/client";
import { RecapitulationCardType } from "@/lib/types/recaptype";

interface RecapitulationCountChartContainerProps {
  periodId: string,
  title: string;
  type: RecapitulationCardType;
};

const RecapitulationCountChartContainer = async ({ periodId, title, type }: RecapitulationCountChartContainerProps) => {

  const legendTitle: { [key: string]: string[] } = {
    studentActiveInactive: ["Active", "Inactive"],
    studentsRegularSore: ["Reg.Pagi", "Reg.Sore"],
  }
  let data;
  let valA;
  let valB;
  if (type === "studentActiveInactive") {
    data = await prisma.reregisterDetail.findMany({
      where: {
        reregister: {
          periodId: periodId,
        },
        student: {
          major: {
            name: title,
          },
        },
      },
      select: {
        student: {
          select: {
            major: true,
          },
        },
        semesterStatus: true,
      },
    });

    // dac = dataActiveCount && dic = dataInactiveCount
    valA = data.filter((d: ReregisterDetail) => d.semesterStatus === "AKTIF").length;
    valB = data.filter((d: ReregisterDetail) => d.semesterStatus !== "AKTIF").length;
  } else if (type === "studentsRegularSore") {
    data = await prisma.reregisterDetail.findMany({
      where: {
        reregister: {
          periodId: periodId,
        },
      },
      select: {
        campusType: true,
      },
    });

    valA = data.filter((d: ReregisterDetail) => d.campusType !== 'SORE').length;
    valB = data.filter((d: ReregisterDetail) => d.campusType === 'SORE').length;
  }

  return (
    <Link
      href={`/list/recapitulations/${periodId}/${type}`}
      className="relative w-full h-full group"
    >
      <div className="hidden group-hover:flex bottom-0 justify-center items-center pr-4 absolute z-10 rounded-br-xl rounded-bl-xl bg-linear-to-b from-stone-950/0 to-stone-950/95 w-full h-[40%]">
        <span className="text-white font-semibold transition duration-700 delay-100 ease-in-out hover:-translate-x-2">Detail</span>
        <span>
          <svg
            className="w-6 h-6 fill-white"
            // width="24" height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.92 11.6202C17.8724 11.4974 17.801 11.3853 17.71 11.2902L12.71 6.29019C12.6168 6.19695 12.5061 6.12299 12.3842 6.07253C12.2624 6.02207 12.1319 5.99609 12 5.99609C11.7337 5.99609 11.4783 6.10188 11.29 6.29019C11.1968 6.38342 11.1228 6.49411 11.0723 6.61594C11.0219 6.73776 10.9959 6.86833 10.9959 7.00019C10.9959 7.26649 11.1017 7.52188 11.29 7.71019L14.59 11.0002H7C6.73478 11.0002 6.48043 11.1055 6.29289 11.2931C6.10536 11.4806 6 11.735 6 12.0002C6 12.2654 6.10536 12.5198 6.29289 12.7073C6.48043 12.8948 6.73478 13.0002 7 13.0002H14.59L11.29 16.2902C11.1963 16.3831 11.1219 16.4937 11.0711 16.6156C11.0203 16.7375 10.9942 16.8682 10.9942 17.0002C10.9942 17.1322 11.0203 17.2629 11.0711 17.3848C11.1219 17.5066 11.1963 17.6172 11.29 17.7102C11.383 17.8039 11.4936 17.8783 11.6154 17.9291C11.7373 17.9798 11.868 18.006 12 18.006C12.132 18.006 12.2627 17.9798 12.3846 17.9291C12.5064 17.8783 12.617 17.8039 12.71 17.7102L17.71 12.7102C17.801 12.6151 17.8724 12.5029 17.92 12.3802C18.02 12.1367 18.02 11.8636 17.92 11.6202Z"

            />
          </svg>
        </span>
      </div>
      <div className="bg-white relative rounded-xl w-full h-full p-4">
        {/* TITLE */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">{title}</h1>
          <Image src={"/moreDark.png"} alt="more-icon" width={20} height={20} className="" />
        </div>
        {/* CHART */}
        <CountChart valueA={valA} valueB={valB} />
        {/* BOTTOM */}
        <div className="flex justify-center gap-16 -mt-1">
          <div className="flex flex-col gap-0.5">
            <div className="bg-ternary rounded-full w-3.5 h-3.5" />
            <h1 className="font-bold text-sm">{valA}</h1>
            <h2 className="text-xs text-gray-400">{legendTitle[type][0]} ({Math.round((valA / (valA + valB)) * 100)}%)</h2>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="bg-secondary rounded-full w-3.5 h-3.5" />
            <h1 className="font-bold text-sm">{valB}</h1>
            <h2 className="text-xs text-gray-400">{legendTitle[type][1]} ({Math.round((valB / (valA + valB)) * 100)}%)</h2>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RecapitulationCountChartContainer;
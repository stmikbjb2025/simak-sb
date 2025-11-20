import { prisma } from "@/lib/prisma";
import { RecapitulationCardType } from "@/lib/types/recaptype";
import Image from "next/image";
import Link from "next/link";

interface RecapitulationCardProptypes {
  periodId: string
  type: RecapitulationCardType,
  label: string,
};

const RecapitulationCard = async ({ periodId, type, label }: RecapitulationCardProptypes) => {
  const period = await prisma.period.findUnique({
    where: {
      id: periodId,
    }
  });
  const yearOfPeriod = period?.name?.split(" ")[1];
  let totalStudents: number = 0;

  switch (type) {
    case "studentsRegisteredKrs":
      totalStudents = await prisma.krs.count({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            some: {}
          }
        },
      });
      break;
    case "studentsUnregisteredKrs":
      totalStudents = await prisma.krs.count({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            none: {}
          }
        },
      });
      break;
    case "studentsTakingThesis":
      totalStudents = await prisma.krs.count({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            some: {
              course: {
                isSkripsi: true,
              }
            }
          }
        },
      });
      break;
    case "studentsTakingInternship":
      totalStudents = await prisma.krs.count({
        where: {
          reregister: {
            periodId: periodId,
          },
          krsDetail: {
            some: {
              course: {
                isPKL: true,
              }
            }
          }
        }
      })
      break;
    case "coursekrs":
      const dataCourse = await prisma.krsDetail.findMany({
        where: {
          krs: {
            reregister: {
              periodId: periodId,
            }
          },
        },
        distinct: ['courseId'],
      })
      totalStudents = dataCourse.length;
      break;

    default:
      break;
  }

  return (
    <Link
      href={`/list/recapitulations/${periodId}/${type}`}
      className="relative odd:bg-primary even:bg-secondary rounded-2xl flex-1 min-w-[130px] group"
    >
      <div className="hidden group-hover:flex justify-end items-center pr-4 absolute z-10  rounded-2xl bg-linear-to-r from-stone-950/5 to-stone-950/65 w-full h-full">
        <span className="text-white font-semibold transition duration-700 delay-100 ease-in-out hover:-translate-x-2">Detail</span>
        <span>
          <svg
            className="fill-white"
            width="24" height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.92 11.6202C17.8724 11.4974 17.801 11.3853 17.71 11.2902L12.71 6.29019C12.6168 6.19695 12.5061 6.12299 12.3842 6.07253C12.2624 6.02207 12.1319 5.99609 12 5.99609C11.7337 5.99609 11.4783 6.10188 11.29 6.29019C11.1968 6.38342 11.1228 6.49411 11.0723 6.61594C11.0219 6.73776 10.9959 6.86833 10.9959 7.00019C10.9959 7.26649 11.1017 7.52188 11.29 7.71019L14.59 11.0002H7C6.73478 11.0002 6.48043 11.1055 6.29289 11.2931C6.10536 11.4806 6 11.735 6 12.0002C6 12.2654 6.10536 12.5198 6.29289 12.7073C6.48043 12.8948 6.73478 13.0002 7 13.0002H14.59L11.29 16.2902C11.1963 16.3831 11.1219 16.4937 11.0711 16.6156C11.0203 16.7375 10.9942 16.8682 10.9942 17.0002C10.9942 17.1322 11.0203 17.2629 11.0711 17.3848C11.1219 17.5066 11.1963 17.6172 11.29 17.7102C11.383 17.8039 11.4936 17.8783 11.6154 17.9291C11.7373 17.9798 11.868 18.006 12 18.006C12.132 18.006 12.2627 17.9798 12.3846 17.9291C12.5064 17.8783 12.617 17.8039 12.71 17.7102L17.71 12.7102C17.801 12.6151 17.8724 12.5029 17.92 12.3802C18.02 12.1367 18.02 11.8636 17.92 11.6202Z"

            />
          </svg>
        </span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-green-600 bg-white px-2 py-1 rounded-full">{yearOfPeriod}</span>
          <Image src={"/more.png"} alt="more-icon" width={20} height={20} className="" />
        </div>
        <h1 className="text-xl font-semibold my-2">{totalStudents}</h1>
        <h2 className="text-sm capitalize font-medium text-gray-500">{label}</h2>
      </div>
    </Link>
  )
}

export default RecapitulationCard;
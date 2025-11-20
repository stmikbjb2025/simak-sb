import RecapitulationCard from "@/component/RecapitulationCard";
import RecapitulationCountChartContainer from "@/component/RecapitulationCountChartContainer";
import { prisma } from "@/lib/prisma";

const RecapitulationDetailByPeriodPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const period = await prisma.period.findUnique({
    where: {
      id: id,
    },
  });
  const dataMajor = await prisma.major.findMany({ select: { id: true, name: true } });

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full order-2 md:order-1 md:w-2/3 flex flex-col gap-4">
        <div className="hidden md:flex bg-white p-4 rounded-xl flex-1 mt-0 ">
          <h1 className="text-lg font-semibold">REKAPITULASI/LAPORAN PERIODE {period?.name}</h1>
        </div>
        {/* MIDDLE CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {/* COUNT CHART */}
          <div className="w-full  h-[380px]">
            <RecapitulationCountChartContainer type="studentsRegularSore" periodId={id} title={"Data Mahasiswa"} />
          </div>
          {dataMajor.map((items: any) => (
            <div key={items.id} className="w-full h-[380px]">
              <RecapitulationCountChartContainer type="studentActiveInactive" periodId={id} title={items.name} />
            </div>
          ))}

        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full order-1 md:order-2 md:w-1/3 flex flex-col gap-8">
        <div className="flex flex-col justify-between flex-wrap gap-4">
          <RecapitulationCard periodId={id} type={"coursekrs"} label="Mata kuliah yang diambil" />
          <RecapitulationCard periodId={id} type={"studentsRegisteredKrs"} label="Mahasiswa Sudah KRS" />
          <RecapitulationCard periodId={id} type={"studentsUnregisteredKrs"} label="Mahasiswa Belum KRS" />
          <RecapitulationCard periodId={id} type={"studentsTakingThesis"} label="Mahasiswa Program TA" />
          <RecapitulationCard periodId={id} type={"studentsTakingInternship"} label="Mahasiswa Program PKL" />
        </div>
      </div>
    </div>
  )
}

export default RecapitulationDetailByPeriodPage;
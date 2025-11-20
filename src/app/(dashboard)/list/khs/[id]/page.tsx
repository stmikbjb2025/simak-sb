
import ButtonPdfDownload from "@/component/ButtonPdfDownload";
import Table from "@/component/Table";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { AnnouncementKhs } from "@/generated/prisma/client";
import { KhsDetailBaseTypes, KhsDetailTypes } from "@/lib/types/datatypes/type";

const KHSDetailPage = async (
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const [dataStudent, dataKhs, dataKhsDetail, isNotAnnounce] = await prisma.$transaction(async (prisma: any) => {
    const data = await prisma.khs.findUnique({
      where: {
        id: id,
      },
      select: {
        student: {
          select: {
            name: true,
            nim: true,
            photo: true,
            major: {
              select: { name: true, }
            },
          }
        },
        semester: true,
        period: {
          select: {
            name: true,
          }
        },
        ips: true,
        maxSks: true,
        isRPL: true,
        khsDetail: {
          where: {
            isLatest: true,
            course: {
              isPKL: false
            }
          },
          select: {
            id: true,
            course: {
              select: {
                name: true,
                code: true,
                sks: true,
                isPKL: true,
                isSkripsi: true,
              },
            },
            weight: true,
            gradeLetter: true,
            status: true,
          },
          orderBy: [
            { course: { code: 'asc' } }
          ]
        }
      }
    })

    data.ips = Number(data?.ips);
    data?.khsDetail.forEach((detail: KhsDetailBaseTypes) => {
      detail.weight = detail.status === AnnouncementKhs.ANNOUNCEMENT ? Number(detail?.weight) : 0;
      detail.gradeLetter = detail.status === AnnouncementKhs.ANNOUNCEMENT ? detail?.gradeLetter : 'E';
    });
    const isNotAnnounce = data?.khsDetail.find((item: KhsDetailBaseTypes) => item.status !== AnnouncementKhs.ANNOUNCEMENT);

    const totalSks = data?.khsDetail.map((item: KhsDetailBaseTypes) => item.course.sks)
      .reduce((acc: number, init: number) => acc + init, 0);
    const totalSksNab = data?.khsDetail
      .map((item: KhsDetailBaseTypes) => item.course.sks * item.weight)
      .reduce((acc: number, init: number) => acc + init, 0);

    const dataStudent = data?.student;
    const dataKhs = {
      semester: data?.semester,
      ips: data?.ips,
      maxSks: data?.maxSks,
      period: data?.period?.name,
      isRPL: data?.isRPL,
      totalSks: totalSks,
      totalSksNab: totalSksNab,
    }
    const dataKhsDetail = data?.khsDetail;

    return [dataStudent, dataKhs, dataKhsDetail, isNotAnnounce]
  })

  const columns = [
    {
      header: "Kode",
      accessor: "kode",
      className: "px-4 hidden md:table-cell",
    },
    {
      header: "Mata Kuliah",
      accessor: "mata kuliah",
      className: "px-2 md:px-0",
    },
    {
      header: "SKS",
      accessor: "sks",
      className: "hidden md:table-cell",
    },
    {
      header: "NAB",
      accessor: "nab",
      className: "hidden md:table-cell",
    },
    {
      header: "SKSxNAB",
      accessor: "sksxnab",
      className: "hidden md:table-cell",
    },
  ];

  const renderRow = (item: KhsDetailTypes) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="hidden md:table-cell p-4 md:w-2/10">{item?.course?.code}</td>
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-0 md:w-5/10">
          <div className="flex flex-col col-span-5 items-start">
            <p className="text-xs text-gray-500 md:hidden">{item?.course?.code}</p>
            <h3 className="font-semibold md:font-normal">{item?.course?.name}</h3>
            <p className="text-xs text-gray-500 md:hidden">{item?.course?.sks} sks</p>
          </div>
        </td>
        <td className="hidden md:table-cell md:w-1/10">{item?.course?.sks}</td>
        <td className="hidden md:table-cell md:w-1/10">
          {item?.gradeLetter}
        </td>
        <td className="hidden md:table-cell md:w-1/10">
          {(Number(item?.course?.sks) * Number(item.weight))}
        </td>
      </tr>
    )
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      {/* TOP */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* USER INFO CARD */}
        <div className="bg-primary py-6 px-4 rounded-md flex-1 flex gap-4 w-full lg:w-3/4">
          <div className="hidden md:inline md:w-1/4">
            <Image
              src={dataStudent?.photo ? `/api/avatar?file=${dataStudent?.photo}` : '/avatar.png'}
              alt=""
              width={144}
              height={144}
              className="w-36 h-36 rounded-full object-cover"
            />
          </div>
          <div className="w-full md:w-3/4 flex flex-col justify-between gap-4">
            <header>
              <h1 className="text-xl font-semibold">{dataStudent?.name || ""}</h1>
              <div className="h-0.5 w-full bg-gray-300" />
              <p className="text-sm text-slate-600 font-medium mt-1">
                {dataStudent.nim} | S1-{dataStudent.major.name}
              </p>
            </header>
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-16">Semester</span>
                <span>:</span>
                <span>{dataKhs.semester}</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-16">Thn. Akad</span>
                <span >:</span>
                <span>{dataKhs.period}</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-16">IPK</span>
                <span>:</span>
                <span>{dataKhs?.ips ?? 0}</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="basis-16">Max SKS</span>
                <span>:</span>
                <span>{dataKhs.maxSks ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white w-full lg:w-1/4 flex flex-col gap-4 p-4 rounded-md">
          {!isNotAnnounce && (
            <ButtonPdfDownload id={id} type="khs">
              <div className={`w-full py-4 gap-2 flex items-center justify-center rounded-md bg-primary-dark hover:bg-primary-dark/90`}>
                <Image src={`/icon/printPdf.svg`} alt={`icon-print}`} width={28} height={28} />
                <span className="text-white font-medium text-sm">CETAK KHS</span>
              </div>
            </ButtonPdfDownload>
          )}
        </div>
      </div>
      {/* BOTTOM */}
      <div className="bg-white p-4 rounded-md flex-1 mt-0">
        <div className="flex">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:justify-between">
            <h1 className="text-lg font-semibold">Kartu Hasil Studi</h1>
          </div>
        </div>
        <Table columns={columns} renderRow={renderRow} data={dataKhsDetail} />
        {dataKhs.isRPL === false && (
          <div className="mt-4">
            <div className="flex items-center p-2 mx-2 justify-start gap-8">
              <h1 className="text-sm font-bold md:w-40">Jumlah SKS</h1>
              <h3 className="text-sm font-medium">{dataKhs?.totalSks}</h3>
            </div>
            <div className="flex items-center p-2 mx-2 justify-start gap-8">
              <h1 className="text-sm font-bold md:w-40">Jumlah SKSxNAB</h1>
              <h3 className="text-sm font-medium">{dataKhs?.totalSksNab}</h3>
            </div>
            <div className="flex items-center p-2 mx-2 justify-start gap-8">
              <h1 className="text-sm font-bold md:w-40">IPK</h1>
              <h3 className="text-sm font-medium">{dataKhs.ips}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KHSDetailPage;
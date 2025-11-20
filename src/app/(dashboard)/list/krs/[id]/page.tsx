
import ButtonPdfDownload from "@/component/ButtonPdfDownload";
import FormContainer from "@/component/FormContainer";
import FormCourseKrs from "@/component/FormCourseKrs";
import ModalAction from "@/component/ModalAction";
import Table from "@/component/Table";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { lecturerName } from "@/lib/utils";
import Image from "next/image";
import { KrsDetailTypes } from "@/lib/types/datatypes/type";

const KRSDetailPage = async (
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const user = await getSession();

  const dataKRSRaw = await prisma.krs.findUnique({
    where: {
      id: id,
    },
    include: {
      student: {
        include: {
          major: true,
          lecturer: true,
        },
      },
      reregister: {
        include: {
          period: true,
        }
      },
      krsDetail: {
        include: {
          course: true,
        },
        orderBy: [
          { course: { code: 'asc' } }
        ]
      },
      // krsOverride: true,
    },
  });
  const KRSOverride = await prisma.krsOverride.findFirst({
    where: {
      krsId: id,
    }
  });

  let dataKrsOverridePassToForm;
  if (KRSOverride?.id) {
    dataKrsOverridePassToForm = {
      id: KRSOverride.id,
      krsId: KRSOverride.krsId,
      student: dataKRSRaw.student,
      ips: Number(dataKRSRaw.ips),
      maxSks: dataKRSRaw.maxSks,
      ips_allowed: Number(KRSOverride.ips_allowed),
      sks_allowed: KRSOverride.sks_allowed,
    };
  } else {
    dataKrsOverridePassToForm = {
      id: "",
      krsId: id,
      student: dataKRSRaw.student,
      ips: Number(dataKRSRaw.ips),
      maxSks: dataKRSRaw.maxSks,
      ips_allowed: 0,
      sks_allowed: 0,
    };
  }

  const dataKRS = {
    ...dataKRSRaw,
    ips: dataKRSRaw?.ips ? parseFloat(dataKRSRaw.ips.toString()) : 0,
    krsDetail: dataKRSRaw?.krsDetail.map((item: any) => (
      {
        ...item,
        finalScore: item.finalScore ? parseFloat(item.finalScore.toString()) : 0,
        weight: item.weight ? parseFloat(item.weight.toString()) : 0,
      }
    ))
  }

  const dataReregistrasi = await prisma.reregisterDetail.findUnique({
    where: {
      reregisterId_studentId: {
        reregisterId: dataKRS.reregisterId,
        studentId: dataKRS.studentId,
      },
    },
  });

  const totalSKS = dataKRS?.krsDetail
    .map((item: any) => item.course.sks)
    .reduce((acc: any, init: any) => acc + init, 0);

  const dataPassToForm = {
    id: dataKRS.id,
    student: dataKRS?.student,
    krsDetail: dataKRS?.krsDetail || [],
    semester: dataKRS?.reregister?.period?.semesterType,
    sisaSKS: (KRSOverride?.sks_allowed || dataKRS?.maxSks) - totalSKS,
    maxSKS: KRSOverride?.sks_allowed || dataKRS?.maxSks,
  }

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
      header: "Status",
      accessor: "status",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
      className: "hidden md:table-cell p-4",
    },
  ];

  const renderRow = (item: KrsDetailTypes) => {
    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-200"
      >
        <td className="hidden md:table-cell p-4">{item?.course?.code}</td>
        <td className="grid grid-cols-6 md:flex py-4 px-2 md:px-0">
          <div className="flex flex-col col-span-5 items-start">
            <p className="text-xs text-gray-500 md:hidden">{item?.course?.code}</p>
            <h3 className="font-semibold md:font-normal">{item?.course?.name}</h3>
            <p className="text-xs text-gray-500 md:hidden">{item?.course?.sks} sks</p>
            <span className={`p-1 rounded-lg text-[9px] font-bold self-start md:hidden ${item.isAcc ? "text-green-500 bg-green-100" : "text-gray-500 bg-gray-200"}`}>
              {item?.isAcc ? "ACC" : "Pending"}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2 md:hidden ">
            <ModalAction>
              <div className="flex items-center gap-3">
                {user?.roleType !== "STUDENT" && <FormCourseKrs id={item.id} isAcc={item.isAcc} />}
                <FormContainer table="krsDetail" type="delete" id={item.id} />
              </div>
            </ModalAction>
          </div>
        </td>
        <td className="hidden md:table-cell">{item?.course?.sks}</td>
        <td className="hidden md:table-cell">
          <span className={`p-1 rounded-lg text-[10px] font-bold self-start ${item.isAcc ? "text-green-500 bg-green-100" : "text-gray-500 bg-gray-200"}`}>
            {item?.isAcc ? "ACC" : "Pending"}
          </span>
        </td>
        <td>
          <div className="hidden md:flex items-center gap-2">
            {user?.roleType !== "STUDENT" && <FormCourseKrs id={item.id} isAcc={item.isAcc} />}
            <FormContainer table="krsDetail" type="delete" id={item.id} />
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      {/* TOP */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* USER INFO CARD */}
        <div className="bg-primary py-6 px-4 rounded-md flex-1 flex gap-4 w-full lg:w-4/5">
          <div className="hidden md:inline md:w-1/4">
            <Image
              src={dataKRS?.student?.photo ? `/api/avatar?file=${dataKRS?.student?.photo}` : '/avatar.png'}
              alt=""
              width={144}
              height={144}
              className="w-36 h-36 rounded-full object-cover"
            />
          </div>
          <div className="w-full md:w-3/4 flex flex-col justify-between gap-4">
            <header>
              <h1 className="text-xl font-semibold">{dataKRS?.student?.name || ""}</h1>
              <div className="h-0.5 w-full bg-gray-300" />
              <p className="text-sm text-slate-600 font-medium mt-1">
                {dataKRS.student.nim} | S1-{dataKRS.student.major.name}
              </p>
            </header>
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="w-1/4">Dosen Pembimbing</span>
                <span>:</span>
                <span>
                  {lecturerName(
                    {
                      frontTitle: dataKRS?.student?.lecturer?.frontTitle,
                      name: dataKRS?.student?.lecturer?.name,
                      backTitle: dataKRS?.student?.lecturer.backTitle
                    }
                  )}
                </span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="w-1/4">Semester</span>
                <span>:</span>
                <span>{dataReregistrasi.semester}</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="w-1/4">Thn. Akad</span>
                <span >:</span>
                <span>{dataKRS.reregister?.period?.name}</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="w-1/4">IPK</span>
                <span>:</span>
                <span>{dataKRS?.ips?.toString() ?? 0}</span>
              </div>
              <div className="w-full 2xl:w-1/3 gap-2 flex items-center">
                <span className="w-1/4">Max.SKS/SKS diizinkan</span>
                <span>:</span>
                <span>{dataKRS.maxSks}/{KRSOverride?.sks_allowed ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white w-full lg:w-1/5 flex flex-col gap-4 p-4 rounded-md">
          <ButtonPdfDownload id={id} type="krs">
            <div className={`w-full py-4 gap-2 flex items-center justify-center rounded-md bg-primary-dark hover:bg-primary-dark/90`}>
              <Image src={`/icon/printPdf.svg`} alt={`icon-print}`} width={32} height={32} />
              <span className="text-white font-medium text-sm">CETAK KRS</span>
            </div>
          </ButtonPdfDownload>
          {/* <ButtonPdfDownload id={id} type="krs"> */}
          <div className={`sm:w-8 md:w-full sm:h-16 md:h-18 gap-2 flex items-center justify-center rounded-md bg-accent-dark`}>
            <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10C6.80222 10 6.60888 10.0586 6.44443 10.1685C6.27998 10.2784 6.15181 10.4346 6.07612 10.6173C6.00043 10.8 5.98063 11.0011 6.01921 11.1951C6.0578 11.3891 6.15304 11.5673 6.29289 11.7071C6.43275 11.847 6.61093 11.9422 6.80491 11.9808C6.99889 12.0194 7.19996 11.9996 7.38268 11.9239C7.56541 11.8482 7.72159 11.72 7.83147 11.5556C7.94135 11.3911 8 11.1978 8 11C8 10.7348 7.89464 10.4804 7.70711 10.2929C7.51957 10.1054 7.26522 10 7 10ZM19 6H18V3C18 2.73478 17.8946 2.48043 17.7071 2.29289C17.5196 2.10536 17.2652 2 17 2H7C6.73478 2 6.48043 2.10536 6.29289 2.29289C6.10536 2.48043 6 2.73478 6 3V6H5C4.20435 6 3.44129 6.31607 2.87868 6.87868C2.31607 7.44129 2 8.20435 2 9V15C2 15.7956 2.31607 16.5587 2.87868 17.1213C3.44129 17.6839 4.20435 18 5 18H6V21C6 21.2652 6.10536 21.5196 6.29289 21.7071C6.48043 21.8946 6.73478 22 7 22H17C17.2652 22 17.5196 21.8946 17.7071 21.7071C17.8946 21.5196 18 21.2652 18 21V18H19C19.7956 18 20.5587 17.6839 21.1213 17.1213C21.6839 16.5587 22 15.7956 22 15V9C22 8.20435 21.6839 7.44129 21.1213 6.87868C20.5587 6.31607 19.7956 6 19 6ZM8 4H16V6H8V4ZM16 20H8V16H16V20ZM20 15C20 15.2652 19.8946 15.5196 19.7071 15.7071C19.5196 15.8946 19.2652 16 19 16H18V15C18 14.7348 17.8946 14.4804 17.7071 14.2929C17.5196 14.1054 17.2652 14 17 14H7C6.73478 14 6.48043 14.1054 6.29289 14.2929C6.10536 14.4804 6 14.7348 6 15V16H5C4.73478 16 4.48043 15.8946 4.29289 15.7071C4.10536 15.5196 4 15.2652 4 15V9C4 8.73478 4.10536 8.48043 4.29289 8.29289C4.48043 8.10536 4.73478 8 5 8H19C19.2652 8 19.5196 8.10536 19.7071 8.29289C19.8946 8.48043 20 8.73478 20 9V15Z" />
            </svg>
            <span className="text-white font-medium text-sm">CETAK MK</span>
          </div>
          {/* </ButtonPdfDownload> */}
        </div>
      </div>
      {/* BOTTOM */}
      <div className="bg-white p-4 rounded-md flex-1 mt-0">
        <div className="flex">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:justify-between">
            <h1 className="text-lg font-semibold">Kartu Rencana Studi</h1>
            <div className="flex items-center gap-4 self-end">
              <FormContainer type="create" table="krsDetail" data={dataPassToForm} />

              {user?.roleType !== "STUDENT" && <FormContainer type="update" table="krsOverride" data={dataKrsOverridePassToForm} />}
            </div>
          </div>
        </div>
        <Table columns={columns} renderRow={renderRow} data={dataKRS.krsDetail || []} />
        <div className="flex items-center p-4 justify-center gap-8">
          <h1 className="text-sm font-bold">TOTAL SKS</h1>
          <h3 className="text-sm font-medium">{totalSKS}</h3>
        </div>
      </div>
    </div>
  )
}

export default KRSDetailPage;
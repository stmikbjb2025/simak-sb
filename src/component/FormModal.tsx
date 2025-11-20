"use client";

import React, { Dispatch, JSX, SetStateAction, useActionState, useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { deleteAssessment, deleteClass, deleteClassDetail, deleteCourse, deleteCurriculum, deleteCurriculumDetail, deleteGrade, deleteKrsDetail, deleteKrsRules, deleteLecturer, deleteMajor, deleteOperator, deletePeriod, deletePermission, deletePosition, deletePresence, deleteReregisterDetail, deleteReregistration, deleteRole, deleteRoom, deleteSchedule, deleteScheduleDetail, deleteStudent, deleteTime } from "@/lib/action";
import { toast } from "react-toastify";
import { FormModalProps } from "@/lib/types/formtype";

const PermissionForm = dynamic(() => import("./forms/PermissionForm"), { loading: () => <h1>Loading...</h1> });
const RoleForm = dynamic(() => import("./forms/RoleForm"), { loading: () => <h1>Loading...</h1> });
const MajorForm = dynamic(() => import("./forms/MajorForm"), { loading: () => <h1>Loading...</h1> });
const RoomForm = dynamic(() => import("./forms/RoomForm"), { loading: () => <h1>Loading...</h1> });
const CourseForm = dynamic(() => import("./forms/CourseForm"), { loading: () => <h1>Loading...</h1> });
const LecturerForm = dynamic(() => import("./forms/LecturerForm"), { loading: () => <h1>Loading...</h1> });
const LecturerUserForm = dynamic(() => import("./forms/LecturerUserForm"), { loading: () => <h1>Loading...</h1> });
const OperatorForm = dynamic(() => import("./forms/OperatorForm"), { loading: () => <h1>Loading...</h1> });
const OperatorUserForm = dynamic(() => import("./forms/OperatorUserForm"), { loading: () => <h1>Loading...</h1> });
const StudentForm = dynamic(() => import("./forms/StudentForm"), { loading: () => <h1>Loading...</h1> });
const StudentUserForm = dynamic(() => import("./forms/StudentUserForm"), { loading: () => <h1>Loading...</h1> });
const PeriodForm = dynamic(() => import("./forms/PeriodForm"), { loading: () => <h1>Loading...</h1> });
const ReregistrationForm = dynamic(() => import("./forms/ReregistrationForm"), { loading: () => <h1>Loading...</h1> });
const ReregistrationCreateAllForm = dynamic(() => import("./forms/ReregisterCreateAll"), { loading: () => <h1>Loading...</h1> });
const ReregistrationDetailForm = dynamic(() => import("./forms/ReregisterCreateOne"), { loading: () => <h1>Loading...</h1> });
const ReregistrationStudentForm = dynamic(() => import("./forms/ReregisterStudent"), { loading: () => <h1>Loading...</h1> });
const CurriculumForm = dynamic(() => import("./forms/CurriculumForm"), { loading: () => <h1>Loading...</h1> });
const CurriculumDetailForm = dynamic(() => import("./forms/CurriculumDetailForm"), { loading: () => <h1>Loading...</h1> });
const GradeForm = dynamic(() => import("./forms/GradeForm"), { loading: () => <h1>Loading...</h1> });
const AssessmentForm = dynamic(() => import("./forms/AssessmentForm"), { loading: () => <h1>Loading...</h1> });
const KrsOverrideForm = dynamic(() => import("./forms/KrsForm"), { loading: () => <h1>Loading...</h1> });
const KrsDetailForm = dynamic(() => import("./forms/KrsDetailForm"), { loading: () => <h1>Loading...</h1> });
const KrsRulesForm = dynamic(() => import("./forms/KrsRulesForm"), { loading: () => <h1>Loading...</h1> });
const KhsGradeForm = dynamic(() => import("./forms/KhsGradeForm"), { loading: () => <h1>Loading...</h1> });
const KhsRevisionForm = dynamic(() => import("./forms/KhsGradeRevisionForm"), { loading: () => <h1>Loading...</h1> });
const RplForm = dynamic(() => import("./forms/RplForm"), { loading: () => <h1>Loading...</h1> });
const PositionForm = dynamic(() => import("./forms/PositionForm"), { loading: () => <h1>Loading...</h1> });
const ClassForm = dynamic(() => import("./forms/ClassForm"), { loading: () => <h1>Loading...</h1> });
const ClassDetailForm = dynamic(() => import("./forms/ClassDetailForm"), { loading: () => <h1>Loading...</h1> });
const TimeForm = dynamic(() => import("./forms/TimeForm"), { loading: () => <h1>Loading...</h1> });
const ScheduleForm = dynamic(() => import("./forms/ScheduleForm"), { loading: () => <h1>Loading...</h1> });
const ScheduleDetailForm = dynamic(() => import("./forms/ScheduleDetailForm"), { loading: () => <h1>Loading...</h1> });
const PresenceForm = dynamic(() => import("./forms/PresenceForm"), { loading: () => <h1>Loading...</h1> });
const PresenceDetailForm = dynamic(() => import("./forms/PresenceDetailForm"), { loading: () => <h1>Loading...</h1> });
const PresenceAllForm = dynamic(() => import("./forms/PresenceAllForm"), { loading: () => <h1>Loading...</h1> });

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update" | "createUser" | "updateUser" | "createMany" | "presenceActive" | "presenceNon" | "revision",
    data?: any,
    relatedData?: any,
  ) => JSX.Element;
} = {
  permission: (setOpen, type, data, relatedData) =>
    <PermissionForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  role: (setOpen, type, data, relatedData) =>
    <RoleForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  major: (setOpen, type, data, relatedData) =>
    <MajorForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  room: (setOpen, type, data, relatedData) =>
    <RoomForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  course: (setOpen, type, data, relatedData) =>
    <CourseForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  lecturer: (setOpen, type, data, relatedData) =>
    <LecturerForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  lecturerUser: (setOpen, type, data, relatedData) =>
    <LecturerUserForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  operator: (setOpen, type, data, relatedData) =>
    <OperatorForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  operatorUser: (setOpen, type, data, relatedData) =>
    <OperatorUserForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  student: (setOpen, type, data, relatedData) =>
    <StudentForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  studentUser: (setOpen, type, data, relatedData) =>
    <StudentUserForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  period: (setOpen, type, data, relatedData) =>
    <PeriodForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  reregistration: (setOpen, type, data, relatedData) =>
    <ReregistrationForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  reregistrationCreateAll: (setOpen, type, data, relatedData) =>
    <ReregistrationCreateAllForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  reregistrationDetail: (setOpen, type, data, relatedData) =>
    <ReregistrationDetailForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  reregistrationStudent: (setOpen, type, data, relatedData) =>
    <ReregistrationStudentForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  curriculum: (setOpen, type, data, relatedData) =>
    <CurriculumForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  curriculumDetail: (setOpen, type, data, relatedData) =>
    <CurriculumDetailForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  grade: (setOpen, type, data, relatedData) =>
    <GradeForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  assessment: (setOpen, type, data, relatedData) =>
    <AssessmentForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  krsOverride: (setOpen, type, data, relatedData) =>
    <KrsOverrideForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  krsDetail: (setOpen, type, data, relatedData) =>
    <KrsDetailForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  krsRules: (setOpen, type, data, relatedData) =>
    <KrsRulesForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  khsGrade: (setOpen, type, data, relatedData) =>
    <KhsGradeForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  khsRevision: (setOpen, type, data, relatedData) =>
    <KhsRevisionForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  rpl: (setOpen, type, data, relatedData) =>
    <RplForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  position: (setOpen, type, data, relatedData) =>
    <PositionForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  class: (setOpen, type, data, relatedData) =>
    <ClassForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  classDetail: (setOpen, type, data, relatedData) =>
    <ClassDetailForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  time: (setOpen, type, data, relatedData) =>
    <TimeForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  schedule: (setOpen, type, data, relatedData) =>
    <ScheduleForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  scheduleDetail: (setOpen, type, data, relatedData) =>
    <ScheduleDetailForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  presence: (setOpen, type, data, relatedData) =>
    <PresenceForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  presenceDetail: (setOpen, type, data, relatedData) =>
    <PresenceDetailForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
  presenceAll: (setOpen, type, data, relatedData) =>
    <PresenceAllForm
      setOpen={setOpen}
      type={type}
      data={data}
      relatedData={relatedData}
    />,
};

const deleteActionMap = {
  permission: deletePermission,
  role: deleteRole,
  operator: deleteOperator,
  lecturer: deleteLecturer,
  lecturerUser: deleteLecturer,
  operatorUser: deleteLecturer,
  studentUser: deleteLecturer,
  student: deleteStudent,
  major: deleteMajor,
  room: deleteRoom,
  course: deleteCourse,
  period: deletePeriod,
  reregistration: deleteReregistration,
  reregistrationCreateAll: deleteReregistration,
  reregistrationDetail: deleteReregisterDetail,
  reregistrationStudent: deleteReregisterDetail,
  curriculum: deleteCurriculum,
  curriculumDetail: deleteCurriculumDetail,
  grade: deleteGrade,
  assessment: deleteAssessment,
  krsOverride: deleteKrsDetail, //Belum diubah
  krsDetail: deleteKrsDetail,
  krsRules: deleteKrsRules,
  khsGrade: deleteKrsDetail, //Belum diubah
  khsRevision: deleteKrsDetail, //Belum diubah
  rpl: deleteKrsDetail, //Belum diubah
  position: deletePosition,
  class: deleteClass,
  classDetail: deleteClassDetail,
  time: deleteTime,
  schedule: deleteSchedule,
  scheduleDetail: deleteScheduleDetail,
  presence: deletePresence, //Belum diubah
  presenceDetail: deleteScheduleDetail, //Belum diubah
  presenceAll: deleteScheduleDetail, //Belum diubah
};

const namaTabelMap = {
  permission: "hak akses",
  role: "role",
  operator: "operator",
  lecturer: "dosen",
  lecturerUser: "user dosen",
  operatorUser: "user operator",
  studentUser: "user mahasiswa",
  student: "mahasiswa",
  major: "program studi",
  room: "ruang/lokal",
  course: "mata kuliah",
  period: "periode akademik",
  reregistration: "herregistrasi",
  reregistrationCreateAll: "herregistrasi",
  reregistrationDetail: "herregistrasi mahasiswa",
  reregistrationStudent: "herregistrasi mahasiswa",
  curriculum: "kurikulum",
  curriculumDetail: "",
  grade: "komponen nilai",
  assessment: "penilaian",
  krsOverride: "KRS Overriding",
  krsDetail: "mata kuliah di KRS",
  krsRules: "pengaturan KRS",
  khsGrade: "nilai mata kuliah",
  khsRevision: "revisi nilai mata kuliah",
  rpl: "mata kuliah RPL",
  position: "jabatan",
  class: "kelas",
  classDetail: "mahasiswa",
  time: "waktu pelajaran",
  schedule: "jadwal",
  scheduleDetail: "jadwal",
  presence: "jurnal perkuliahan",
  presenceDetail: "presensi",
  presenceAll: "presensi",
}

const iconMap = {
  create: "create",
  createMany: "createMany",
  createUser: "createUser",
  update: "update",
  updateUser: "updateUser",
  delete: "delete",
  presenceActive: "attendance-white",
  presenceNon: "attendance-white",
  revision: "update",
}

const FormModal = ({ table, type, label, data, id, relatedData }: FormModalProps & { relatedData?: any }) => {
  const size = type === "create" || type === "createMany" ? "w-8 h-8" : "w-7 h-7";
  const bgColor = (type === "createUser" && "bg-secondary") || (type === "create" && "bg-secondary")
    || (type === "update" && "bg-ternary") || (type === "updateUser" && "bg-purple-500/60") || (type === "revision" && "bg-purple-500/60")
    || (type === "delete" && "bg-accent") || (type === "createMany" && "bg-secondary")
    || (type === "presenceActive" && "bg-primary-dark") || (type === "presenceNon" && "bg-accent-dark");
  const [open, setOpen] = useState(false);

  const Form = () => {

    const [state, formAction] = useActionState(deleteActionMap[table], { success: false, error: false, message: "" });

    const router = useRouter();
    useEffect(() => {
      if (state?.success) {
        toast.success(state.message.toString());
        router.refresh();
        setOpen(false);
      }
    }, [state, router])

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="string | number" name="id" value={id} readOnly hidden />
        <span className="text-center font-medium">
          Data akan hilang. apakah anda yakin ingin menghapus data {namaTabelMap[table]} ini?
        </span>
        {state?.error && (<span className="text-xs text-red-400">{state.message.toString() || "something went wrong!"}</span>)}
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Hapus
        </button>
      </form>
    ) : type === "create" || type === "update" || type === "createUser" || type === "updateUser" || type === "createMany" || type === "presenceActive" || type === "presenceNon" || type === "revision" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      "Form not found!"
    )
  }

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/icon/${iconMap[type]}.svg`} alt={`icon-${iconMap[type]}`} width={20} height={20} />  {label}
      </button>

      {open && (
        <div className="w-screen h-screen fixed z-9999 left-0 top-0 bg-black/60  flex items-start justify-center overflow-scroll">
          <div className="bg-white p-4 relative rounded-md mt-8  w-[88%] md:w-[70%] lg:w-[60%] xl:w-[55%] 2xl:w-[50%] h-fit">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src={"/close.png"} alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FormModal;
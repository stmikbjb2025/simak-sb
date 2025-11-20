"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { createReregisterStudent } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ReregistrationStudentInputs, reregistrationStudentSchema } from "@/lib/formValidationSchema";
import moment from "moment";
import { FormProps } from "@/lib/types/formtype";

const ReregisterStudentForm = ({ setOpen, type, data }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReregistrationStudentInputs>({
    resolver: zodResolver(reregistrationStudentSchema)
  })

  const [state, formAction] = useActionState(createReregisterStudent, { success: false, error: false, message: "" });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{`Data Herregistrasi ${data?.reregister?.period?.name}`}</h1>
      <div className="w-full py-4 px-2 bg-amber-300 rounded-md flex flex-col items-center">
        <span className="font-semibold">
          Harap Memperhatikan data yang diisi. Data hanya dapat diisi satu kali.
        </span>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Mahasiswa
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <div className="hidden">
            <InputField
              label="reregisterId"
              name="reregisterId"
              defaultValue={data?.reregisterId || data?.idReregister}
              register={register}
              error={errors?.reregisterId}
            />
            <InputField
              label="studentId"
              name="studentId"
              defaultValue={data?.studentId}
              register={register}
              error={errors?.studentId}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="NIM"
            name="nim"
            defaultValue={data?.student?.nim}
            register={register}
            inputProps={{ disabled: true }}
            error={errors?.nim}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-8/12">
          <InputField
            label="Nama Mahasiswa"
            name="name"
            defaultValue={data?.student?.name}
            register={register}
            inputProps={{ disabled: true }}
            error={errors?.name}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Angkatan"
            name="year"
            defaultValue={data?.student?.year}
            register={register}
            inputProps={{ disabled: true }}
            error={errors?.year}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Semester"
            name="semester"
            defaultValue={data?.semester}
            register={register}
            inputProps={{ disabled: true }}
            error={errors?.semester}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Program Studi"
            name="major"
            defaultValue={data?.student?.major?.name}
            register={register}
            inputProps={{ disabled: true }}
            error={errors?.major}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Tipe Perkuliahan</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("campusType")}
            disabled={true}
            defaultValue={data?.campusType}
          >
            <option
              value={""} key={""}
              className="text-sm py-0.5 capitalize"
            >
              -- Pilih Tipe Perkuliahan
            </option>
            <option
              value={"BJM"} key={"bjm"}
              className="text-sm py-0.5 capitalize"
            >
              Banjarmasin
            </option>
            <option
              value={"BJB"} key={"bjb"}
              className="text-sm py-0.5 capitalize"
            >
              Banjarbaru
            </option>
            <option
              value={"ONLINE"} key={"online"}
              className="text-sm py-0.5 capitalize"
            >
              Online
            </option>
            <option
              value={"SORE"} key={"sore"}
              className="text-sm py-0.5 capitalize"
            >
              Sore
            </option>
          </select>
          {errors.campusType?.message && (
            <p className="text-xs text-red-400">
              {errors.campusType.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-8/12">
          <InputField
            label="Perwalian Akademik"
            name="lecturerId"
            defaultValue={data?.student?.lecturer?.name}
            register={register}
            inputProps={{ disabled: true }}
            error={errors?.lecturerId}
          />
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Mahasiswa
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Tempat Lahir"
            name="placeOfBirth"
            defaultValue={data?.student?.placeOfBirth}
            register={register}
            error={errors?.placeOfBirth}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Tanggal Lahir"
            name="birthday"
            type="date"
            defaultValue={moment(data?.student?.birthday).format("yyyy-MM-dd")}
            register={register}
            error={errors?.birthday}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="No. Telp/HP"
            name="hp"
            defaultValue={data?.student?.hp}
            register={register}
            error={errors?.hp}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Email"
            name="email"
            defaultValue={data?.student?.email}
            register={register}
            error={errors?.email}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-11/12">
          <label className="text-xs text-gray-500">Alamat Asal/Domisili</label>
          <textarea
            {...register("domicile")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Alamat asal/domisili"
            defaultValue={data?.student?.domicile}
          ></textarea>
          {errors.domicile?.message && (
            <p className="text-xs text-red-400">
              {errors.domicile.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-11/12">
          <label className="text-xs text-gray-500">Alamat Sekarang</label>
          <textarea
            {...register("address")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Isi dengan alamat asal jika sama dengan alamat asal"
            defaultValue={data?.student?.address}
          ></textarea>
          {errors.address?.message && (
            <p className="text-xs text-red-400">
              {errors.address.message.toString()}
            </p>
          )}
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Orang Tua/Wali
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Nama Orang Tua/Wali"
            name="guardianName"
            defaultValue={data?.student?.guardianName}
            register={register}
            error={errors?.guardianName}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="NIK Orang Tua/Wali"
            name="guardianNIK"
            defaultValue={data?.student?.guardianNIK}
            register={register}
            error={errors?.guardianNIK}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Pekerjaan Orang Tua/Wali"
            name="guardianJob"
            defaultValue={data?.student?.guardianJob}
            register={register}
            error={errors?.guardianJob}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="No. Telp/HP Orang Tua/Wali"
            name="guardianHp"
            defaultValue={data?.student?.guardianHp}
            register={register}
            error={errors?.guardianHp}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-11/12">
          <label className="text-xs text-gray-500">Alamat Orang Tua/Wali</label>
          <textarea
            {...register("guardianAddress")}
            defaultValue={data?.student?.guardianAddress}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Alamat orang tua/wali"
          ></textarea>
          {errors.guardianAddress?.message && (
            <p className="text-xs text-red-400">
              {errors.guardianAddress.message.toString()}
            </p>
          )}
        </div>

      </div>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Ibu Kandung
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputField
            label="Nama Ibu Kandung"
            name="motherName"
            defaultValue={data?.student?.motherName}
            register={register}
            error={errors?.motherName}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputField
            label="NIK Ibu Kandung"
            name="motherNIK"
            defaultValue={data?.student?.motherNIK}
            register={register}
            error={errors?.motherNIK}
          />
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">{state.message.toString()}</span>)}
      <button
        className="bg-blue-400 text-white p-2 rounded-md disabled:bg-blue-500/30 disabled:cursor-not-allowed"
        disabled={data?.isStatusForm}
      >
        Kirim Data
      </button>
    </form >
  )
}

export default ReregisterStudentForm;
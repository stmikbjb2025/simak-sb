"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import moment from "moment";

import InputField from "../InputField";
import InputSelect from "../InputSelect";
import { StudentInputs, studentSchema } from "@/lib/formValidationSchema";
import { createStudent, updateStudent } from "@/lib/action";
import { ACCEPTED_IMAGE_TYPES, gender, religion, status, StatusRegister } from "@/lib/setting";
import { handleNumericInput } from "@/lib/utils";
import { FormProps } from "@/lib/types/formtype";

const StudentForm = ({ setOpen, type, data, relatedData }: FormProps) => {
  const isCreate = type === 'create';
  const isRevision = type === 'revision';
  const { majors, lecturer } = relatedData;
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(
    data?.photo ? `/api/avatar?file=${data?.photo}` : null
  );
  const formRefs = useRef<HTMLFormElement>(null);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<StudentInputs>({
    resolver: zodResolver(studentSchema.omit({ photo: true })),
  })

  const action = isCreate ? createStudent : updateStudent;
  const [state, formAction] = useActionState(action, {
    success: false,
    error: false,
    message: ""
  });

  // Handler untuk update preview image ketika file input berubah
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Buat object URL untuk preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    } else {
      setPreview(data?.photo ? `/api/avatar?file=${data?.photo}` : null)
    }
  }

  const onValid = useCallback(() => {
    formRefs.current?.requestSubmit();
  }, [])

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <form ref={formRefs} action={formAction} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{isCreate ? "Tambah data mahasiswa baru" : "Ubah data mahasiswa"}</h1>

      <span className="text-xs text-gray-400 font-medium">
        Informasi Personal
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <div className="hidden">
            <InputField
              label="id"
              name="id"
              defaultValue={data.id}
              register={register}
              error={errors?.id}
            />
            <input type="hidden" name="oldFoto" value={data.photo ?? ''} />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="NIM"
            name="nim"
            defaultValue={data?.nim}
            inputProps={{
              readOnly: isRevision,
              inputMode: "numeric",
              onInput: handleNumericInput,
            }}
            register={register}
            error={errors?.nim}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Nama Lengkap"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Tahun Mendaftar"
            name="year"
            defaultValue={data?.year}
            inputProps={{
              readOnly: isRevision,
              inputMode: "numeric",
              onInput: handleNumericInput,
            }}
            register={register}
            error={errors?.year}
            required={true}
          />
        </div>
        <div className={isRevision ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
          <InputSelect
            control={control}
            label="Program Studi"
            name="majorId"
            required={true}
            error={errors?.majorId}
            placeholder="-- Pilih prodi"
            defaultValue={data?.majorId}
            options={majors.map((item: { id: number, name: string }) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </div>
        <div className={isRevision ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
          <InputSelect
            label="Dosen Wali"
            name="lecturerId"
            control={control}
            error={errors?.lecturerId}
            placeholder="-- Pilih dosen wali"
            defaultValue={data?.lecturerId}
            required={true}
            options={lecturer.map((item: { id: string, name: string }) => ({
              value: item.id,
              label: item.name
            }))}
          />
        </div>
        <div className={isRevision ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
          <InputSelect
            label="Status Registrasi"
            name="statusRegister"
            control={control}
            defaultValue={data?.statusRegister}
            error={errors?.statusRegister}
            placeholder="-- Pilih status.."
            required={true}
            options={StatusRegister.map((item: string) => ({
              value: item,
              label: item,
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputSelect
            control={control}
            label="Gender"
            name="gender"
            defaultValue={data?.gender}
            placeholder="--Pilih Gender"
            required={true}
            error={errors?.gender}
            options={gender.map((item: string) => ({
              value: item,
              label: item,
            }))}
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="photo"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            className="hidden"
            accept={ACCEPTED_IMAGE_TYPES}
            onChange={handleFileChange}
          />
          {errors.photo?.message && (
            <p className="text-xs text-red-400">
              {errors.photo.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Preview Foto</label>
          {preview && (
            <div>
              <Image
                src={preview}
                alt="Preview"
                height={80}
                width={80}
                className="w-20 h-20 object-cover border border-gray-200 rounded-full"
              />
            </div>
          )}
        </div>
        <div className={isRevision ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
          <InputSelect
            label="Status Mahasiswa"
            name="studentStatus"
            control={control}
            defaultValue={data?.studentStatus}
            error={errors?.studentStatus}
            placeholder="-- Pilih status.."
            required={true}
            options={status.map((item: string) => ({
              value: item,
              label: item,
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputSelect
            label="Agama"
            name="religion"
            control={control}
            error={errors?.religion}
            defaultValue={data?.religion}
            placeholder="--pilih Agama..."
            required={true}
            options={religion.map((item: string) => ({
              value: item,
              label: item
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Personal Email"
            name="email"
            type="email"
            defaultValue={data?.email}
            register={register}
            error={errors?.email}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="No. Handphone"
            name="phone"
            type="tel"
            inputProps={{
              inputMode: "numeric",
              onInput: handleNumericInput,
            }}
            defaultValue={data?.hp}
            register={register}
            error={errors?.phone}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Tempat lahir"
            name="placeOfBirth"
            defaultValue={data?.placeOfBirth}
            register={register}
            error={errors?.placeOfBirth}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Tanggal lahir"
            name="birthday"
            type="date"
            defaultValue={data?.birthday ? moment(data.birthday).format("yyyy-MM-DD") : undefined}
            register={register}
            error={errors?.birthday}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-11/12">
          <label className="text-xs text-gray-500">Alamat Asal/Domisili</label>
          <textarea
            {...register("domicile")}
            defaultValue={data?.domicile}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
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
            defaultValue={data?.address}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          ></textarea>
          {errors.address?.message && (
            <p className="text-xs text-red-400">
              {errors.address.message.toString()}
            </p>
          )}
        </div>
      </div >
      <span className="text-xs text-gray-400 font-medium">
        Informasi Ortu/Wali Mahasiswa
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Nama Orang Tua/Wali"
            name="guardianName"
            register={register}
            defaultValue={data?.guardianName}
            error={errors?.guardianName}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="NIK Orang Tua/Wali"
            name="guardianNIK"
            defaultValue={data?.guardianNIK}
            register={register}
            error={errors?.guardianNIK}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Pekerjaan Orang Tua/Wali"
            name="guardianJob"
            register={register}
            defaultValue={data?.guardianJob}
            error={errors?.guardianJob}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="No. Telp/HP Orang Tua/Wali"
            name="guardianHp"
            register={register}
            defaultValue={data?.guardianHp}
            error={errors?.guardianHp}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-11/12">
          <label className="text-xs text-gray-500">Alamat Orang Tua/Wali</label>
          <textarea
            {...register("guardianAddress")}
            defaultValue={data?.guardianAddress}
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
            defaultValue={data?.motherName}
            register={register}
            error={errors?.motherName}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputField
            label="NIK Ibu Kandung"
            name="motherNIK"
            defaultValue={data?.motherNIK}
            register={register}
            error={errors?.motherNIK}
          />
        </div>
      </div>

      {state?.error && (
        <span className="text-xs text-red-400">{state.message.toString()}</span>
      )}
      <button
        type="submit"
        onClick={handleSubmit(onValid)}
        className="bg-blue-400 text-white p-2 rounded-md cursor-pointer hover:bg-blue-500 transition-colors"
      >
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default StudentForm;
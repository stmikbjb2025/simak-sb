"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { LecturerInputs, lecturerSchema } from "@/lib/formValidationSchema";
import { createLecturer, updateLecturer } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { degree, gender, religion } from "@/lib/setting";
import Image from "next/image";
import InputSelect from "../InputSelect";
import { FormProps } from "@/lib/types/formtype";

const LecturerForm = ({ setOpen, type, data, relatedData }: FormProps) => {
  const { majors } = relatedData;
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(data?.photo ? `/api/avatar?file=${data?.photo}` : null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LecturerInputs>({
    resolver: zodResolver(lecturerSchema.omit({ photo: true }))
  })

  const action = type === "create" ? createLecturer : updateLecturer;
  const [state, formAction] = useActionState(action, { success: false, error: false, message: "" });

  const onValid = useCallback(() => {
    formRef.current?.requestSubmit()
  }, [])

  // Handler untuk update preview image ketika file input berubah
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    if (file) {
      // Buat object URL untuk preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    } else {
      setPreview(data?.photo ? `/api/avatar?file=${data?.photo}` : null)
    }
  };

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data dosen baru" : "Ubah data dosen"}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Personal
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <div className="hidden">
            <InputField
              label="id"
              name="id"
              defaultValue={data?.id}
              register={register}
              error={errors?.id}
            />
            <input type="hidden" name="oldFoto" value={data.photo ?? ''} />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="NPK"
            name="npk"
            defaultValue={data?.npk}
            register={register}
            error={errors?.npk}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="NIDN"
            name="nidn"
            defaultValue={data?.nidn}
            register={register}
            error={errors?.nidn}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="NUPTK"
            name="nuptk"
            defaultValue={data?.nuptk}
            register={register}
            error={errors?.nuptk}
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Gelar Nama Depan"
            name="frontTitle"
            defaultValue={data?.frontTitle}
            register={register}
            error={errors?.frontTitle}
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
            label="Gelar Nama Belakang"
            name="backTitle"
            defaultValue={data?.backTitle}
            register={register}
            error={errors?.backTitle}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputSelect
            control={control}
            label="Pendidikan Terakhir"
            name="degree"
            required={true}
            error={errors?.degree}
            placeholder="-- Pilih pend..."
            defaultValue={data?.degree}
            options={degree.map((item: string) => ({
              value: item,
              label: item,
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Tahun Masuk"
            name="year"
            defaultValue={data?.year}
            register={register}
            error={errors?.year}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
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
            accept="image/jpeg, image/jpg, image/png"
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
                width={80}
                height={80}
                alt="Preview"
                className="w-20 h-20 object-cover border border-gray-200 rounded-full"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputSelect
            label="Agama"
            name="religion"
            placeholder="--Pilih Agama"
            control={control}
            error={errors?.religion}
            defaultValue={data?.religion}
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
            defaultValue={data?.email}
            register={register}
            error={errors?.email}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="No. Handphone"
            name="hp"
            defaultValue={data?.hp}
            register={register}
            error={errors?.hp}
          />
        </div>


        <div className="flex flex-col gap-2 w-full md:w-3/5">
          <label className="text-xs text-gray-500">Alamat</label>
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
      </div>
      {state?.error && (<span className="text-xs text-red-400">{state.message.toString()}</span>)}
      <button
        className="bg-blue-400 text-white p-2 rounded-md cursor-pointer"
        onClick={handleSubmit(onValid)}
      >
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default LecturerForm;
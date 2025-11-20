"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { CourseInputs, courseSchema } from "@/lib/formValidationSchema";
import { createCourse, updateCourse } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Select from "react-select";
import { courseType } from "@/lib/setting";
import InputSelect from "../InputSelect";
import { FormProps } from "@/lib/types/formtype";

const CourseForm = ({ setOpen, type, data, relatedData }: FormProps) => {
  const { majors, courses, assessmentType } = relatedData;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CourseInputs>({
    resolver: zodResolver(courseSchema)
  })

  const action = type === "create" ? createCourse : updateCourse
  const [state, formAction] = useActionState(action, { success: false, error: false, message: "" });

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
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data mata kuliah baru" : "Ubah data mata kuliah"}</h1>

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
          </div>
        )}
        <div className="flex flex-col gap-2 w-full md:w-3/12">
          <InputField
            label="Kode Matkul"
            name="code"
            defaultValue={data?.code}
            register={register}
            error={errors?.code}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/12">
          <InputField
            label="SKS"
            name="sks"
            defaultValue={data?.sks}
            register={register}
            error={errors?.sks}
            required={true}
            inputProps={{
              inputMode: "numeric",
              onInput: (e: FormEvent<HTMLInputElement>) => (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/[^0-9.]/g, '')
            }}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <InputField
            label="Nama Mata Kuliah"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
            required={true}
          />
        </div>
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-3/12">
          <InputSelect
            label="Bentuk Penilaian"
            name="assessmentId"
            placeholder="Pilih penilaian"
            control={control}
            defaultValue={data?.assessmentId}
            error={errors?.assessmentId}
            options={assessmentType.map((item: Record<string, string | number>) => ({
              value: item.id,
              label: item.name,
            }))}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/12">
          <InputSelect
            label="Program Studi"
            name="majorId"
            placeholder="Pilih prodi"
            control={control}
            defaultValue={data?.majorId}
            error={errors?.majorId}
            options={majors.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/12">
          <label className="text-xs text-gray-500">Mata Kuliah Terdahulu</label>
          <Controller
            name="predecessorId"
            control={control}
            defaultValue={data?.predecessorId || ""}
            render={({ field }) => (
              <Select
                {...field}
                options={courses.map((course: any) => ({
                  value: course.id,
                  label: `(${course.code}) ${course.name}`,
                }))}
                isClearable
                placeholder="-- Pilih mata kuliah terdahulu"
                classNamePrefix="react-select"
                className="text-sm rounded-md"
                onChange={(selected: any) => field.onChange(selected ? selected.value : "")}
                value={
                  courses
                    .map((course: any) => ({
                      value: course.id,
                      label: `(${course.code})${course.name}`,
                    }))
                    .find((option: any) => option.value === field.value) || null
                }
              />
            )}
          />
          {errors.predecessorId?.message && (
            <p className="text-xs text-red-400">
              {errors.predecessorId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-6/12">
          <InputSelect
            label="Kategori Matkul"
            name="courseType"
            defaultValue={data?.courseType}
            control={control}
            error={errors?.courseType}
            placeholder="-- pilih kategori matkul"
            required={true}
            options={courseType.map((item: string) => ({
              value: item,
              label: item,
            }))}
          />
        </div>
        <div className="flex flex-col items-start gap-2 w-full md:w-5/12">
          <label className="text-xs text-gray-500">Mata Kuliah PKL atau Skripsi</label>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 w-full">
              <input type="checkbox" id="isPKL" {...register("isPKL")} className="w-4 h-4 " defaultChecked={data?.isPKL} />
              <label htmlFor="isPKL" className="text-sm text-gray-600">PKL</label>
            </div>
            <div className="flex items-center gap-2 w-full">
              <input type="checkbox" id="isSkripsi" {...register("isSkripsi")} className="w-4 h-4 " defaultChecked={data?.isSkripsi} />
              <label htmlFor="isSkripsi" className="text-sm text-gray-600">Skripsi</label>
            </div>
          </div>
          {errors.isPKL?.message && (
            <p className="text-xs text-red-400">
              {errors.isPKL.message.toString()}
            </p>
          )}
        </div>

      </div>
      {state?.error && (<span className="text-xs text-red-400">{state.message.toString()}</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default CourseForm;
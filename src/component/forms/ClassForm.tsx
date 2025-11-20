"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { ClassInputs, classSchema } from "@/lib/formValidationSchema";
import { createClass, updateClass } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import Select from "react-select";
import { FormProps } from "@/lib/types/formtype";


const ClassForm = ({ setOpen, type, data, relatedData }: FormProps) => {
  const { rooms, lecturers, courses } = relatedData;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue
  } = useForm<ClassInputs>({
    resolver: zodResolver(classSchema)
  })
  const action = type === "create" ? createClass : updateClass;
  const [state, formAction] = useActionState(action, { success: false, error: false, message: "" });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (!data.periodId) {
      toast.error("Tidak ada data periode akademik yang aktif.");
      setOpen(false);
    } else if (state?.success) {
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type, data])

  return (
    <>
      {
        data.periodId ? (
          <form onSubmit={onSubmit} className="flex flex-col gap-8">
            <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data kelas baru" : "Ubah data kelas"}</h1>
            <div className="flex justify-between flex-wrap gap-4">
              {data && (
                <div className="hidden">
                  <>
                    <InputField
                      label="id"
                      name="id"
                      defaultValue={data?.id}
                      register={register}
                      error={errors?.id}
                    />
                    <InputField
                      label="PeriodeId"
                      name="periodId"
                      defaultValue={data?.periodId}
                      register={register}
                      error={errors?.periodId}
                    />
                  </>
                </div>
              )}
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <InputField
                  label="Periode Akademik"
                  name="period"
                  inputProps={{ disabled: true }}
                  defaultValue={data?.periodName}
                  register={register}
                />
              </div>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              Informasi Kelas
            </span>
            <div className="flex justify-between flex-wrap gap-4">
              <div className="flex flex-col gap-2 w-full">
                <label className="text-xs text-gray-500 after:content-['_(*)'] after:text-red-400">Mata Kuliah</label>
                <Controller
                  name="courseId"
                  control={control}
                  defaultValue={data?.courseId || ""}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={courses.map((course: { [key: string]: string | number }) => ({
                        value: course.id,
                        label: `${course.code} | ${course.name}`,
                      }))}
                      isClearable
                      placeholder="Pilih Mata Kuliah"
                      classNamePrefix="react-select"
                      className="text-sm rounded-md"
                      onChange={(selected: any) => {
                        const selectedCourse = courses.find((c: any) => c.id === selected?.value);
                        field.onChange(selected ? selected.value : "");
                        if (selectedCourse) {
                          const name = `${selectedCourse.semester}${selectedCourse.major.toLowerCase().includes("sistem informasi") ? 1 : 6}`
                          setValue("name", name);
                          setValue("semester", selectedCourse.semester);
                          setValue("major", selectedCourse.major || "");
                          setValue("participants", selectedCourse.participants || 0);
                        } else {
                          setValue("name", "");
                          setValue("semester", 0);
                          setValue("major", "");
                          setValue("participants", 0);
                        }
                      }}
                      value={
                        courses
                          .map((course: any) => ({
                            value: course.id,
                            label: `${course.code} | ${course.name}`,
                          }))
                          .find((option: any) => option.value === field.value) || null
                      }
                    />
                  )}
                />
                {errors.courseId?.message && (
                  <p className="text-xs text-red-400">
                    {errors.courseId?.message.toString()}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/5">
                <InputField
                  label="Nama Kelas"
                  name="name"
                  defaultValue={data?.name}
                  register={register}
                  error={errors?.name}
                  required={true}
                />
                <div className="text-xs font-medium text-amber-400">
                  Edit setelah mengisi mata kuliah!
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/5">
                <InputField
                  label="Peserta Matkul"
                  name="participants"
                  inputProps={{ readOnly: true }}
                  defaultValue={courses.find((course: { [key: string]: string | number }) => course.id === data?.courseId)?.participants || 0}
                  register={register}
                  error={errors?.participants}
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/5">
                <InputField
                  label="Program Studi"
                  name="major"
                  inputProps={{ readOnly: true }}
                  defaultValue={data?.course?.major?.name || ""}
                  register={register}
                  error={errors?.major}
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/5">
                <InputField
                  label="Semester"
                  name="semester"
                  inputProps={{ readOnly: true }}
                  defaultValue={data?.semester}
                  register={register}
                  error={errors?.semester}
                />
              </div>
            </div>
            <div className="flex justify-between flex-wrap gap-4">
              <div className="flex flex-col gap-2 w-full md:w-1/2">
                <InputSelect
                  control={control}
                  label="Dosen Pengampu"
                  name="lecturerId"
                  placeholder="Pilih Dosen Pengampu"
                  defaultValue={data?.lecturerId}
                  error={errors?.lecturerId}
                  required={true}
                  options={lecturers.map((item: Record<string, string | number>) => ({
                    value: item.id,
                    label: `${item.frontTitle ? item.frontTitle + " " : ""}${item.name} ${item.backTitle ? item.backTitle : ""}`,
                  }))}
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-1/3">
                <InputSelect
                  control={control}
                  label="Ruang Kelas"
                  name="roomId"
                  placeholder="Pilih Ruang Kelas"
                  defaultValue={data?.roomId}
                  error={errors?.roomId}
                  required={true}
                  options={rooms.map((item: Record<string, string | number>) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </div>
            </div>
            {state?.error && (<span className="text-xs text-red-400">{state.message.toString()}</span>)}
            <button className="bg-blue-400 text-white p-2 rounded-md">
              {type === "create" ? "Tambah" : "Ubah"}
            </button>
          </form >
        ) : (null)
      }
    </>
  )
}

export default ClassForm;
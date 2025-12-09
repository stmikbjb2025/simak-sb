"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { ScheduleDetailInputs, scheduleDetailSchema } from "@/lib/formValidationSchema";
import { createScheduleDetail, updateScheduleDetail } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import { dayName } from "@/lib/setting";
import Select from "react-select";
import { FormProps } from "@/lib/types/formtype";

const ScheduleDetailForm = ({ setOpen, type, data, relatedData }: FormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ScheduleDetailInputs>({
    resolver: zodResolver(scheduleDetailSchema)
  })

  const { time, academicClass, rooms } = relatedData;
  const action = type === "create" ? createScheduleDetail : updateScheduleDetail;
  const [state, formAction] = useActionState(action, { success: false, error: false, message: "" });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      state.message.toString().includes("bentrok") ?
        toast.warning(state.message.toString()) :
        toast.success(state.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? `Tambah Data Jadwal Kelas` : `Ubah Jadwal Kelas`}</h1>

      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <>
            <div className="visible">
              <InputField
                label="id"
                name="id"
                defaultValue={data?.id}
                register={register}
                error={errors?.id}
              />
            </div>
            <div className="visible">
              <InputField
                label="scheduleId"
                name="scheduleId"
                defaultValue={data?.scheduleId}
                register={register}
                error={errors?.scheduleId}
              />
            </div>
          </>

        )}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500 after:content-['_(*)'] after:text-red-400">Kelas dan Mata Kuliah</label>
          <Controller
            name="academicClass"
            control={control}
            defaultValue={data?.academicClassId || ""}
            render={({ field }) => (
              <Select
                {...field}
                options={academicClass.map((cls: any) => ({
                  value: cls.id,
                  label: `${cls.course.code} | ${cls.course.name}`,
                  data: cls,
                }))}
                getOptionLabel={(e) => e.label}
                formatOptionLabel={(option: any) => {
                  const { data } = option;
                  return (
                    <div className="flex flex-col text-sm my-1">
                      <h3 className="font-semibold">Kelas: {data.name}</h3>
                      <h3 className="text-gray-500">{data.course.code}</h3>
                      <h1 className="font-medium">{data.course.name}</h1>
                      <h2>{data.lecturer.name}</h2>
                    </div>
                  )
                }}
                isClearable
                placeholder="Pilih Kelas dan Mata Kuliah"
                className="text-sm rounded-md react-select-container"
                classNamePrefix="react-select"
                onChange={(selected) => {
                  field.onChange(selected ? selected.value : "");
                }}
                value={
                  academicClass
                    .map((academicClass: any) => ({
                      value: academicClass.id,
                      label: `${academicClass.course.code} | ${academicClass.course.name}`,
                      data: academicClass,
                    }))
                    .find((option: any) => option.value === field.value) || null
                }
              />
            )}
          />
          {errors.academicClass?.message && (
            <p className="text-xs text-red-400">
              {errors.academicClass?.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/10">
          <InputSelect
            control={control}
            name="dayName"
            label="Hari"
            defaultValue={data?.dayName}
            placeholder="Pilih Hari"
            required={true}
            error={errors?.dayName}
            options={dayName.map((item: string) => ({
              value: item,
              label: item,
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/10">
          <InputSelect
            control={control}
            name="time"
            label="Waktu Pelajaran"
            defaultValue={data?.timeId}
            placeholder="Pilih Waktu Pelajaran"
            required={true}
            error={errors?.time}
            options={time.map((item: { id: string, timeStart: Date, timeFinish: Date }) => ({
              value: item.id,
              label: `${new Intl.DateTimeFormat("id-ID", { hour: "numeric", minute: "numeric" }).format(item.timeStart)} - ${new Intl.DateTimeFormat("id-ID", { hour: "numeric", minute: "numeric" }).format(item.timeFinish)}`,
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/10">
          <InputSelect
            control={control}
            name="roomId"
            label="Ruang Kelas"
            defaultValue={data?.roomId}
            placeholder="Pilih Ruang Kelas"
            required={true}
            error={errors?.roomId}
            options={rooms.map((item: { id: string, name: string }) => ({
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
  )
}

export default ScheduleDetailForm;
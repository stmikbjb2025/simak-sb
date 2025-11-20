"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { PresenceInputs, presenceSchema } from "@/lib/formValidationSchema";
import { createPresence, updatePresence } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import moment from "moment";
import { learningMethod } from "@/lib/setting";
import { FormProps } from "@/lib/types/formtype";

const PresenceForm = ({ setOpen, type, data }: FormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PresenceInputs>({
    resolver: zodResolver(presenceSchema)
  })
  const action = type === "create" ? createPresence : updatePresence;
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
      <h1 className="text-xl font-semibold">{'Formulir Jurnal Perkuliahan'}</h1>

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
            <InputField
              label="academicClassId"
              name="academicClassId"
              defaultValue={data?.academicClassId}
              register={register}
              error={errors?.academicClassId}
            />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full">
          <InputField
            label="Info Kelas"
            name="academicClass"
            defaultValue={`Kelas ${data?.academicClass.name} | ${data?.academicClass.course.name}`}
            register={register}
            inputProps={{ readOnly: true, disabled: true }}
            error={errors?.academicClass}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputField
            label="Pertemuan/Minggu"
            name="weekNumber"
            defaultValue={data?.weekNumber}
            register={register}
            inputProps={{ readOnly: true }}
            error={errors?.weekNumber}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputField
            label="Tanggal Perkuliahan"
            name="date"
            type="date"
            defaultValue={moment(data?.date || new Date()).format('YYYY-MM-DD')}
            register={register}
            error={errors?.date}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-11/12">
          <label className="text-xs text-gray-500">Pokok Bahasan</label>
          <textarea
            {...register("lesson")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Pokok Bahasan"
            defaultValue={data?.lesson}
          ></textarea>
          {errors.lesson?.message && (
            <p className="text-xs text-red-400">
              {errors.lesson.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-11/12">
          <label className="text-xs text-gray-500">Sub Pokok Bahasan</label>
          <textarea
            {...register("lessonDetail")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Sub Pokok Bahasan"
            defaultValue={data?.lessonDetail}
          ></textarea>
          {errors.lessonDetail?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonDetail.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputField
            label="Durasi Perkuliahan"
            name="duration"
            defaultValue={data?.duration}
            register={register}
            error={errors?.duration}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-5/9">
          <label className="text-xs text-gray-500">Metode</label>
          <Controller
            name="learningMethod"
            control={control}
            defaultValue={data.learningMethod}
            render={({ field }) => (
              <>
                {learningMethod.map((method) => (
                  <div key={method}>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={method}
                        checked={field.value?.includes(method)}
                        onChange={(e) => {
                          const value = e.target.value
                          const isChecked = e.target.checked
                          const newValue = isChecked
                            ? [...field.value, value]
                            : field.value.filter((v) => v !== value)
                          field.onChange(newValue)
                        }}
                      />
                      <span>{method}</span>
                    </label>
                  </div>
                ))}
              </>
            )}
          />
          {errors.learningMethod && (
            <p className="text-red-500 text-sm">{errors.learningMethod.message}</p>
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

export default PresenceForm;
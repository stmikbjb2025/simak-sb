"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { ScheduleInputs, scheduleSchema } from "@/lib/formValidationSchema";
import { createSchedule, updateSchedule } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import { FormProps } from "@/lib/types/formtype";

const ScheduleForm = ({ setOpen, type, data, relatedData }: FormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ScheduleInputs>({
    resolver: zodResolver(scheduleSchema)
  })

  const { period } = relatedData;

  const action = type === "create" ? createSchedule : updateSchedule;
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data jadwal kuliah baru" : "Ubah data jadwal kuliah"}</h1>

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
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <InputField
            label="Nama Jadwal"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputSelect
            label="Periode Akademik"
            name="periodId"
            control={control}
            defaultValue={data?.periodId}
            error={errors?.periodId}
            placeholder="Pilih Periode Akademik"
            required={true}
            options={period.map((item: any) => ({
              value: item.id,
              label: item.name
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-xs text-gray-500">Status Jadwal Perkuliahan</label>
          <Controller
            name="isActive"
            control={control}
            defaultValue={!!data?.isActive}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <label htmlFor="isActive" className="peer flex items-center justify-start gap-1.5 text-sm text-gray-600 has-checked:text-indigo-900 has-checked:font-medium">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Mengaktifkan Jadwal
                </label>
                <div className="hidden text-xs font-medium text-amber-400 peer-has-checked:flex">
                  Jadwal sebelumnya akan dinonaktifkan !
                </div>
              </div>
            )}
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

export default ScheduleForm;
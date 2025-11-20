"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { TimeInputs, timeSchema } from "@/lib/formValidationSchema";
import { createTime, updateTime } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import moment from "moment";
import { FormProps } from "@/lib/types/formtype";

const TimeForm = ({ setOpen, type, data }: FormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TimeInputs>({
    resolver: zodResolver(timeSchema)
  })
  const action = type === "create" ? createTime : updateTime;
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data waktu pelajaran baru" : "Ubah data waktu pelajaran"}</h1>

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
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <InputField
            label="Waktu Mulai"
            name="timeStart"
            type="time"
            defaultValue={moment(data?.timeStart).format("HH:mm")}
            register={register}
            error={errors?.timeStart}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <InputField
            label="Waktu Selesai"
            name="timeFinish"
            type="time"
            defaultValue={moment(data?.timeFinish).format("HH:mm")}
            register={register}
            error={errors?.timeFinish}
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

export default TimeForm;
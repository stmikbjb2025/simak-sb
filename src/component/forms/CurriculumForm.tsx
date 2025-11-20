"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { CurriculumInputs, curriculumSchema } from "@/lib/formValidationSchema";
import { createCurriculum, updateCurriculum } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import moment from "moment";
import InputSelect from "../InputSelect";
import { FormProps } from "@/lib/types/formtype";

const CurriculumForm = ({ setOpen, type, data, relatedData }: FormProps) => {
  const { majors } = relatedData;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CurriculumInputs>({
    resolver: zodResolver(curriculumSchema)
  })

  const action = type === "create" ? createCurriculum : updateCurriculum
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data kurikulum baru" : "Ubah data kurikulum"}</h1>

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
        <div className="flex flex-col gap-2 w-full md:w-3/5">
          <InputField
            label="Kurikulum"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/6">
          <InputSelect
            control={control}
            label="Program Studi"
            name="majorId"
            required={true}
            error={errors?.majorId}
            placeholder="-- Pilih program studi"
            defaultValue={data?.majorId}
            options={majors.map((item: Record<string, string | number>) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </div>

      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/5">
          <InputField
            label="Tanggal Mulai"
            name="startDate"
            type="date"
            defaultValue={moment(data?.startDate).format("YYYY-MM-DD")}
            register={register}
            error={errors?.startDate}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/5">
          <InputField
            label="Tanggal Selesai"
            name="endDate"
            type="date"
            defaultValue={moment(data?.endDate).format("YYYY-MM-DD")}
            register={register}
            error={errors?.endDate}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-xs text-gray-500">Status Kurikulum</label>
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
                  Mengaktifkan Kurikulum
                </label>
                <div className="hidden text-sm font-medium text-amber-400 peer-has-checked:flex">
                  Kurikulum sebelumnya akan dinonaktifkan !
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

export default CurriculumForm;
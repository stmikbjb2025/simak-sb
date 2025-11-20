"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { PeriodInputs, periodSchema } from "@/lib/formValidationSchema";
import { createPeriod, updatePeriod } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import { semester } from "@/lib/setting";
import { FormProps } from "@/lib/types/formtype";

const PeriodForm = ({ setOpen, type, data }: FormProps) => {

  // untuk membuat +10thn dan -10thn di dropdown select
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => `${currentYear - 10 + i}/${currentYear - 10 + i + 1}`);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PeriodInputs>({
    resolver: zodResolver(periodSchema)
  })
  const action = type === "create" ? createPeriod : updatePeriod;
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data periode akademik baru" : "Ubah data periode akademik"}</h1>

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
          <InputSelect
            control={control}
            name="year"
            defaultValue={data?.name.split(" ")[1]}
            placeholder="Pilih Tahun Akademik"
            error={errors.year}
            options={years.map((year: string) => ({
              value: year,
              label: year,
            }))}
            label="Tahun Akademik"
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <InputSelect
            control={control}
            name="semesterType"
            defaultValue={data?.semesterType}
            placeholder="Pilih Semester"
            error={errors.semesterType}
            options={semester.map((semester: string) => ({
              value: semester,
              label: semester,
            }))}
            label="Semester"
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Status Periode Akademik</label>
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
                  Mengaktifkan Periode Akademik
                </label>
                <div className="hidden text-sm font-medium text-amber-400 peer-has-checked:flex">
                  Periode Akademik sebelumnya akan dinonaktifkan !
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

export default PeriodForm;
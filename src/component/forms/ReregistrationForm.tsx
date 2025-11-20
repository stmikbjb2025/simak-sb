"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { ReregistrationInputs, reregistrationSchema } from "@/lib/formValidationSchema";
import { createReregistration, updateReregistration } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import { FormProps } from "@/lib/types/formtype";

const ReregistrationForm = ({ setOpen, type, data, relatedData }: FormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ReregistrationInputs>({
    resolver: zodResolver(reregistrationSchema)
  })

  const { period } = relatedData;

  const action = type === "create" ? createReregistration : updateReregistration;
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data her-registrasi baru" : "Ubah data her-registrasi"}</h1>

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
            label="Titel her registrasi"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputSelect
            label="Semester"
            name="periodId"
            control={control}
            defaultValue={data?.periodId}
            error={errors?.periodId}
            required={true}
            options={period.map((item: Record<string, string | number>) => ({
              value: item.id,
              label: item.name
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-xs text-gray-500">Status Herregistrasi</label>
          <Controller
            name="isReregisterActive"
            control={control}
            defaultValue={!!data?.isReregisterActive}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <input
                  id="isReregisterActive"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-4 h-4 has-checked:text-indigo-900"
                />
                <label htmlFor="isReregisterActive" className="text-sm text-gray-600">
                  Mengaktifkan Herregistrasi
                </label>
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

export default ReregistrationForm;
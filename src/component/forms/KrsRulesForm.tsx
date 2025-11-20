"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputField from "../InputField";
import { KrsRulesInputs, krsRulesSchema } from "@/lib/formValidationSchema";
import { createKrsRules, updateKrsRules } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import { StatusRegister } from "@/lib/setting";
import { FormProps } from "@/lib/types/formtype";

const KrsRulesForm = ({ setOpen, type, data }: FormProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<KrsRulesInputs>({
    resolver: zodResolver(krsRulesSchema)
  })

  const action = type === "create" ? createKrsRules : updateKrsRules;
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data pengaturan rencana studi" : "Ubah data pengaturan rencana studi"}</h1>

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
        <div className="flex flex-col gap-2 w-full md:w-4/12">
          <InputSelect
            label="Status Register Mahasiswa"
            name="statusRegister"
            control={control}
            error={errors.statusRegister}
            placeholder="--Pilih status register"
            options={StatusRegister.map((item: string) => ({
              value: item,
              label: item,
            }))}
            defaultValue={data?.statusRegister}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/12">
          <InputField
            label="Semester"
            name="semester"
            defaultValue={data?.semester || 1}
            register={register}
            inputProps={
              {
                inputMode: "numeric",
                onInput: (e: FormEvent<HTMLInputElement>) => (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/[^0-9.]/g, '')
              }
            }
            error={errors?.semester}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-3/12">
          <InputField
            label="Max. SKS"
            name="maxSks"
            defaultValue={data?.maxSks || 0}
            register={register}
            inputProps={
              {
                inputMode: "numeric",
                onInput: (e: FormEvent<HTMLInputElement>) => (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/[^0-9.]/g, '')
              }
            }
            error={errors?.maxSks}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Auto Paket MK</label>
          <Controller
            name="autoPackage"
            control={control}
            defaultValue={!!data?.autoPackage}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <input
                  id="autoPackage"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-4 h-4 has-checked:text-indigo-900"
                />
                <label htmlFor="autoPackage" className="text-sm text-gray-600">
                  {field.value ? "Paket aktif" : "Paket non-aktif"}
                </label>
              </div>
            )}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Status Aturan KRS</label>
          <Controller
            name="isActive"
            control={control}
            defaultValue={!!data?.isActive}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="w-4 h-4 has-checked:text-indigo-900"
                />
                <label htmlFor="isActive" className="text-sm text-gray-600">
                  {field.value ? "Aktif" : "Non-aktifkan"}
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

export default KrsRulesForm;
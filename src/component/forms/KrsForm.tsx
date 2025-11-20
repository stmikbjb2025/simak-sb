"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { krsOverride, KrsOverrideInputs } from "@/lib/formValidationSchema";
import { createKrsOverride } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { calculatingSKSLimits } from "@/lib/utils";
import { FormProps } from "@/lib/types/formtype";

const KrsForm = ({ setOpen, type, data }: FormProps) => {

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<KrsOverrideInputs>({
    resolver: zodResolver(krsOverride),
  })
  const [state, formAction] = useActionState(createKrsOverride, { success: false, error: false, message: "" });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data))
  })

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(state?.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Form menambah SKS</h1>
        </header>

        <div className="flex justify-between flex-wrap gap-4">
          {data && (
            <>
              <div className="hidden">
                <InputField
                  label="id"
                  name="id"
                  defaultValue={data?.id}
                  register={register}
                  error={errors?.id}
                />
              </div>
              <div className="hidden">
                <InputField
                  label="krsId"
                  name="krsId"
                  defaultValue={data?.krsId}
                  register={register}
                  error={errors?.krsId}
                />
              </div>
            </>
          )}
          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <InputField
              label="Mahasiswa"
              name="name"
              inputProps={{ readOnly: true }}
              defaultValue={data?.student.name}
              register={register}
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <InputField
              label="NIM"
              name="nim"
              inputProps={{ readOnly: true }}
              defaultValue={data?.student.nim}
              register={register}
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <InputField
              label="Prodi"
              name="major"
              inputProps={{ readOnly: true }}
              defaultValue={data?.student.major.name}
              register={register}
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <InputField
              label="IPK saat ini"
              name="ips"
              inputProps={{ readOnly: true }}
              defaultValue={data?.ips}
              register={register}
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <InputField
              label="SKS saat ini"
              name="sks"
              inputProps={{ readOnly: true }}
              defaultValue={data?.maxSks}
              register={register}
            />
          </div>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          IPK dan SKS perubahan
        </span>
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <label className={"text-xs text-gray-500 after:content-['_(*)'] after:text-red-400"}>IPK yang diizinkan</label>
            <input
              type="text"
              {...register("ips_allowed")}
              inputMode="decimal"
              defaultValue={data?.ips_allowed}
              onInput={(e: FormEvent<HTMLInputElement>) => (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/[^0-9.]/g, '')}
              onChange={async (e) => {
                const value = e.target.value;
                setValue("sks_allowed", await calculatingSKSLimits(Number(value)));
              }}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full disabled:text-gray-800 disabled:ring-gray-500 disabled:bg-gray-200"
            />
            {errors?.ips_allowed?.message && (
              <p className="text-xs text-red-400">{errors?.ips_allowed?.message.toString()}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full md:w-1/3">
            <InputField
              label="Max. SKS yang diizinkan"
              name="sks_allowed"
              defaultValue={data?.sks_allowed}
              register={register}
              inputProps={
                {
                  readOnly: true,
                  inputMode: "numeric",
                  onInput: (e: FormEvent<HTMLInputElement>) => (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/[^0-9.]/g, '')
                }
              }
              required={true}
              error={errors?.sks_allowed}
            />
          </div>
        </div>
        <button className="bg-blue-400 text-white p-2 rounded-md">
          {"Tambah"}
        </button>
      </form >
    </>
  )
}

export default KrsForm;
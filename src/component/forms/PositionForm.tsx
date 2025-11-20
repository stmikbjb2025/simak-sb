"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { PositionInputs, positionSchema } from "@/lib/formValidationSchema";
import { createPosition, updatePosition } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import { position } from "@/lib/setting";
import { FormProps } from "@/lib/types/formtype";


const PositionForm = ({ setOpen, type, data }: FormProps) => {

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PositionInputs>({
    resolver: zodResolver(positionSchema)
  })
  const action = type === "create" ? createPosition : updatePosition;
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Tambah data jabatan baru" : "Ubah data jabatan"}</h1>

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
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputSelect
            control={control}
            label="Jabatan"
            name="positionName"
            defaultValue={data?.positionName}
            placeholder="--Pilih Jabatan"
            error={errors.positionName}
            required={true}
            options={position.map((item: string) => ({
              value: item,
              label: item,
            }))}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-2/5">
          <InputField
            label="Nama Lengkap"
            name="personName"
            defaultValue={data?.personName}
            register={register}
            error={errors?.personName}
            required={true}
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

export default PositionForm;
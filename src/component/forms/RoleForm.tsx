"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { FieldError, useForm } from "react-hook-form";
import InputField from "../InputField";
import { RoleInputs, roleSchema } from "@/lib/formValidationSchema";
import { createRole } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import { FormProps } from "@/lib/types/formtype";

const RoleForm = ({ setOpen, type, data, relatedData }: FormProps) => {
  const { permissions } = relatedData;
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RoleInputs>({
    resolver: zodResolver(roleSchema)
  })

  const [state, formAction] = useActionState(createRole, { success: false, error: false, message: "" });

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
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? "Buat data role baru" : "Ubah data role"}</h1>

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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputField
            label="Nama Role"
            name="name"
            required={true}
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-4/6">
          <InputField
            label="Deskripsi Role"
            name="description"
            defaultValue={data?.description}
            register={register}
            error={errors?.description}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <div className="text-xs text-gray-500">Tipe role pengguna</div>
          <div className="flex items-center gap-2">
            <input type="radio" id="roleTypeOperator" value={"OPERATOR"} {...register('roleType')} defaultChecked={true} defaultValue={data?.roleType} />
            <label htmlFor="roleTypeOperator" className="text-sm">Operator</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="radio" id="roleTypeStudent" value={"STUDENT"} {...register('roleType')} defaultChecked={false} defaultValue={data?.roleType} />
            <label htmlFor="roleTypeStudent" className="text-sm">Mahasiswa</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="radio" id="roleTypeLecturer" value={"LECTURER"} {...register('roleType')} defaultChecked={false} defaultValue={data?.roleType} />
            <label htmlFor="roleTypeLecturer" className="text-sm">Dosen</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="radio" id="roleTypeAdvisor" value={"ADVISOR"} {...register('roleType')} defaultChecked={false} defaultValue={data?.roleType} />
            <label htmlFor="roleTypeAdvisor" className="text-sm">Perwalian Akademik</label>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-4/6">
          <InputSelect
            label="Hak Akses"
            name="rolePermission"
            control={control}
            error={errors?.rolePermission as FieldError}
            placeholder="-- pilih hak akses"
            required={true}
            isMulti={true}
            options={permissions.map((item: Record<string, string | number>) => ({
              value: item.id,
              label: item.name
            }))}
          />
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">{state?.message.toString()}</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default RoleForm;
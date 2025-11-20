"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { UserInputs, userSchema } from "@/lib/formValidationSchema";
import { createUserOperator, updateUserOperator } from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputSelect from "../InputSelect";
import { FormProps } from "@/lib/types/formtype";


const OperatorUserForm = ({ setOpen, type, data, relatedData }: FormProps) => {
  const { role } = relatedData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UserInputs>({
    resolver: zodResolver(userSchema)
  })

  const action = type === "createUser" ? createUserOperator : updateUserOperator;
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
      <h1 className="text-xl font-semibold">{"Akun pengguna operator"}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Informasi Autentikasi
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <div className="hidden">
          <InputField
            label="id"
            name="id"
            defaultValue={data?.user?.id || data?.id}
            register={register}
            error={errors?.id}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <InputField
            label="Email"
            name="username"
            defaultValue={data?.user?.email}
            register={register}
            error={errors?.username}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <InputField
            label="Password"
            name="password"
            type="password"
            defaultValue={type === "createUser" ? "" : "password"}
            register={register}
            error={errors?.password}
            required={true}
          />
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <InputSelect
            label="Role Pengguna"
            name="roleId"
            defaultValue={data?.user?.roleId}
            error={errors?.roleId}
            control={control}
            options={role.map((item: { id: number, name: string }) => ({
              value: item.id,
              label: item.name,
            }))}
            required={true}
          />
        </div>
        <div className="flex flex-col items-start gap-2 w-full md:w-1/3 md:mt-1">
          <label className="text-xs text-gray-500 after:content-['_(*)'] after:text-red-400">Status User</label>
          <div className="flex items-center justify-center gap-2">
            <input type="checkbox" id="isStatus" {...register("isStatus")} className="w-4 h-4 " defaultChecked={data?.user?.isStatus} />
            <label htmlFor="isStatus"> mengaktifkan status user</label>
          </div>
          {errors.isStatus?.message && (
            <p className="text-xs text-red-400">
              {errors.isStatus.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">{state.message.toString()}</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md cursor-pointer">
        {"Buat Akun Pengguna"}
      </button>
    </form>
  )
}

export default OperatorUserForm;
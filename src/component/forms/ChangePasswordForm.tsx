'use client';

import { changePassword } from "@/lib/auth";
import { ChangePasswordInputs, changePasswordSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ChangePasswordForm = ({ data }: { data: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInputs>({
    resolver: zodResolver(changePasswordSchema)
  });
  const [state, formAction, pending] = useActionState(changePassword, { success: false, error: false, message: "" });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data));
  });

  const router = useRouter();

  useEffect(() => {
    if (state?.error) {
      toast.error(state.message);
    } else if (state?.success) {
      toast.success(state.message);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 md:p-12 rounded-lg shadow-2xl flex flex-col gap-2">
      <h1 className="text-xl font-bold flex items-center gap-2 mb-6">
        Ganti Password
      </h1>
      <div className="flex flex-col md:w-2xs lg:w-xs xl:w-sm gap-2">
        <label className="text-xs text-gray-500">
          Username/Email
        </label>
        <input
          type="email"
          id="email"
          readOnly={true}
          defaultValue={data?.email}
          {...register("email")}
          className={errors.email?.message ? "p-2 rounded-md ring-2 ring-red-400" : "p-2 rounded-md ring-1 ring-gray-300"}
        />
        {errors.email?.message && (
          <p className="text-xs text-red-400">
            {errors.email.message.toString()}
          </p>
        )}
      </div>
      <div className="flex flex-col md:w-2xs lg:w-xs xl:w-sm gap-2">
        <label className="text-xs text-gray-500">
          Password Lama
        </label>
        <input
          type="password"
          id="oldPassword"
          {...register("oldPassword")}
          className={errors.oldPassword?.message ? "p-2 rounded-md ring-2 ring-red-400" : "p-2 rounded-md ring-1 ring-gray-300"}
        />
        {errors.oldPassword?.message && (
          <p className="text-xs text-red-400">
            {errors.oldPassword.message.toString()}
          </p>
        )}
      </div>
      <div className="flex flex-col md:w-2xs lg:w-xs xl:w-sm gap-2">
        <label className="text-xs text-gray-500">
          Password Baru
        </label>
        <input
          type="password"
          id="newPassword"
          {...register("newPassword")}

          className={errors.newPassword?.message ? "p-2 rounded-md ring-2 ring-red-400" : "p-2 rounded-md ring-1 ring-gray-300"}
        />
        {errors.newPassword?.message && (
          <p className="text-xs text-red-400">
            {errors.newPassword.message.toString()}
          </p>
        )}
      </div>
      <div className="flex flex-col md:w-2xs lg:w-xs xl:w-sm gap-2">
        <label className="text-xs text-gray-500">
          Konfirmasi Password Baru
        </label>
        <input
          type="password"
          id="confirmPassword"
          {...register("confirmPassword")}
          className={errors.confirmPassword?.message ? "p-2 rounded-md ring-2 ring-red-400" : "p-2 rounded-md ring-1 ring-gray-300"}
        />
        {errors.confirmPassword?.message && (
          <p className="text-xs text-red-400">
            {errors.confirmPassword.message.toString()}
          </p>
        )}
      </div>
      <button className="bg-blue-400 text-white p-2 mt-8 cursor-pointer rounded-md disabled:bg-blue-400/70 disabled:cursor-progress" disabled={pending}>
        Ganti Password
      </button>
    </form>
  )
}

export default ChangePasswordForm;
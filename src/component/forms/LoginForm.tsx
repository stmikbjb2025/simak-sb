'use client';

import { login } from "@/lib/auth";
import { redirectDashboardByRole } from "@/lib/dal";
import { LoginInputs, loginSchema } from "@/lib/formValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema)
  });
  const [state, formAction, pending] = useActionState(login, { success: false, error: false, message: "" });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => formAction(data));
  });

  const router = useRouter();

  useEffect(() => {
    if (state?.error) {
      toast.error(state.message);
    } else if (state?.success) {
      toast.success(state.message);
      redirectDashboardByRole()
        .then((res) => {
          router.push("/" + res);
        })
        .catch((err) => {
          console.error(err)
        });
    }
  }, [state, router]);

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 md:p-12 rounded-md shadow-2xl flex flex-col gap-2">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Image src="/logo.png" alt="" width={24} height={24} />
        STMIK BANJARBARU
      </h1>
      <h2 className="text-gray-400">Sign in to your account</h2>
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">
          Username/Email
        </label>
        <input
          type="text"
          id="username"
          {...register("username")}
          className={errors.username?.message ? "p-2 rounded-md ring-2 ring-red-400" : "p-2 rounded-md ring-1 ring-gray-300"}
        />
        {errors.username?.message && (
          <p className="text-xs text-red-400">
            {errors.username.message.toString()}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">
          Password
        </label>
        <input
          type="password"
          id="password"
          {...register("password")}
          className={errors.password?.message ? "p-2 rounded-md ring-2 ring-red-400" : "p-2 rounded-md ring-1 ring-gray-300"}
        />
        {errors.password?.message && (
          <p className="text-xs text-red-400">
            {errors.password.message.toString()}
          </p>
        )}
      </div>
      <button className="bg-blue-400 text-white p-2 mt-2.5 cursor-pointer rounded-md disabled:bg-blue-400/70 disabled:cursor-progress" disabled={pending}>
        <span></span>
        Log in
      </button>
    </form>
  )
}

export default LoginForm;
// Form ini digunakan untuk menambahkan mahasiswa ke daftar herregistrasi
"use client";

import { reregisterCreateAll } from "@/lib/action";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormProps } from "@/lib/types/formtype";


const ReregisterCreateAll = ({ setOpen, type, data }: FormProps) => {

  const [state, formAction] = useActionState(reregisterCreateAll, { success: false, error: false, message: "" });

  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, router, setOpen, type])
  return (
    <form action={formAction} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Manambahkan data mahasiswa</h1>

      <div className="flex justify-center flex-wrap gap-4">
        <input type="string | number" name="id" value={data?.reregisterId} readOnly hidden />
        <div className="flex flex-col gap-2 w-full md:w-full">
          Data mahasiswa akan ditambahkan pada {data?.name}
        </div>
      </div>
      {state?.error && (<span className="text-xs text-red-400">{state.message.toString()}</span>)}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "createMany" ? "Tambah" : "Ubah"}
      </button>
    </form >
  )
}

export default ReregisterCreateAll;
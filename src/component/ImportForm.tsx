'use client';

import { importExcelFile } from "@/lib/action";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ImportForm = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [state, formAction] = useActionState(importExcelFile, { success: false, error: false, message: "" });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message.toString());
      router.refresh();
      setOpen(false);
    }
  }, [state, setOpen, router]);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`text-xs font-medium w-fit py-2 px-4 text-gray-900 bg-secondary/70 rounded-full cursor-pointer capitalize hover:bg-secondary`}
      >
        {"import"}
      </button>
      
      {open && (
        <div className="w-screen h-screen fixed z-9999 left-0 top-0 bg-black/60  flex items-start justify-center overflow-scroll">
          <div className="bg-white p-4 relative rounded-md mt-8  w-[88%] md:w-[70%] lg:w-[60%] xl:w-[55%] 2xl:w-[50%] h-fit">
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src={"/close.png"} alt="" width={14} height={14} />
            </div>
            <div>
              <form action={formAction} className="flex flex-col gap-8">
                <h1 className="text-xl font-semibold">{"Import daftar nilai"}</h1>
                <div className="flex justify-between flex-wrap gap-4">
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                      htmlFor="paymentReceiptFile"
                    >
                      <span>Upload file excel</span>
                    </label>
                    <input type="file" id="uploadFile" name="uploadFile"
                      className="file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-600 dark:file:text-violet-100 dark:hover:file:bg-violet-500"
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />
                  </div>
                </div>
                {state?.error && (<span className="text-xs text-red-400">{state?.message}</span>)}
                <button className="bg-blue-400 text-white p-2 rounded-md">
                  Tambah data
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ImportForm;
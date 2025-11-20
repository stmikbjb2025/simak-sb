"use client";

import { updateKrsDetail } from "@/lib/action";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

type FormCourseKrs = {
  id: string,
  isAcc: boolean,
};

const FormCourseKrs = ({ id, isAcc }: FormCourseKrs) => {
  const [state, formAction, pending] = useActionState(updateKrsDetail, { success: false, error: false, message: "" })

  const prevPendingRef = useRef(false);
  const router = useRouter();
  useEffect(() => {
    if (!prevPendingRef.current && pending) {
      prevPendingRef.current = true;
    }

    if (state?.success && prevPendingRef.current) {
      toast.success(state.message.toString());
      router.refresh();
      prevPendingRef.current = false;
    }
  }, [state, pending, router]);

  return (
    <form action={formAction}>
      <input type="text | number" name="id" value={id} readOnly hidden />
      <input type="text" name="isAcc" value={isAcc.toString()} readOnly hidden />
      <button
        disabled={pending || isAcc}
        className={`w-7 h-7 flex items-center justify-center rounded-full bg-ternary disabled:bg-ternary/30 disabled:cursor-not-allowed`}
      >
        <Image src="/icon/check.svg" alt="" width={22} height={22} />
      </button>
    </form>
  )
}

export default FormCourseKrs;
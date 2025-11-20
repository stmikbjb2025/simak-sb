'use client';

import { updatePresenceStatus } from "@/lib/action";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface PresenceStatusProps {
  role: string,
  data?: any,
}

const PresenceStatus = ({ role, data }: PresenceStatusProps) => {
  // console.log('DATA DARI COMPONENT PRESENCE STATUS', data);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  data.presence.isActive = role === "STUDENT" ? data?.presence.isActive : true;

  const style = ['w-10 h-7 px-2 rounded-md flex justify-start items-center text-xs font-bold border-b-4 gap-1 cursor-pointer']
  if (data.presence.isActive) {
    style.push('border-indigo-500')
  } else {
    style.push('border-gray-500')
  }

  if (data.presenceStatus === undefined) style.push('bg-gray-300')
  if (data.presenceStatus === 'HADIR') style.push('bg-primary')
  if (data.presenceStatus === 'IZIN') style.push('bg-ternary')
  if (data.presenceStatus === 'SAKIT') style.push('bg-secondary')
  if (data.presenceStatus === 'ALPA') style.push('bg-accent')

  const [state, formAction] = useActionState(updatePresenceStatus, { success: false, error: false, message: "" })

  const handleClick = async (status: string) => {
    const updatePresence = {
      id: data.id,
      status: data.presenceStatus,
    };

    if (status === 'H') updatePresence.status = "HADIR";
    if (status === 'I') updatePresence.status = "IZIN";
    if (status === 'S') updatePresence.status = "SAKIT";
    if (status === 'A') updatePresence.status = "ALPA";

    startTransition(() => formAction(updatePresence));
    setOpen(false)
  }

  useEffect(() => {
    if (state.success) {
      toast.success(state?.message.toString());
    }
    if (state.error) {
      toast.error(state?.message.toString());
    }
    router.refresh();
  }, [state, setOpen, router])

  return (
    <div className="relative">
      <button
        className={style.join(" ")}
        onClick={() => data.presence.isActive && setOpen(!open)}
      >
        <span className="font-medium">{data.presence.weekNumber}|</span>
        {(data.presenceStatus === 'HADIR' && 'H') || (data.presenceStatus === 'IZIN' && 'I') || (data.presenceStatus === 'SAKIT' && 'S') || (data.presenceStatus === 'ALPA' && 'A') || (data.presenceStatus === undefined && '-')}
      </button>
      {open && (
        <div className="absolute top-8 right-0 bg-white shadow-lg shadow-gray-400 rounded-md p-2 z-50 w-24">
          <div className="flex items-end justify-between my-3 w-full">
            <ul className="w-full flex flex-col gap-1">
              <li className="font-medium tracking-wide py-1.5 bg-primary rounded-sm cursor-pointer" onClick={() => handleClick('H')}><span className="ml-1">HADIR</span></li>
              <li className="font-medium tracking-wide py-1.5 bg-ternary rounded-sm cursor-pointer" onClick={() => handleClick('I')}><span className="ml-1">IZIN</span></li>
              <li className="font-medium tracking-wide py-1.5 bg-secondary rounded-sm cursor-pointer" onClick={() => handleClick('S')}><span className="ml-1">SAKIT</span></li>
              <li className="font-medium tracking-wide py-1.5 bg-accent rounded-sm cursor-pointer" onClick={() => handleClick('A')}><span className="ml-1">ALPA</span></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default PresenceStatus;
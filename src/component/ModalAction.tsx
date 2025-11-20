'use client';

import Image from "next/image";
import { useState } from "react";

const ModalAction = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-row items-center absolute">
      <div className={`px-4 py-3 z-10 rounded-md transition duration-100 ${open ? "opacity-100 bg-primary-light" : "opacity-0"}`}>
        {children}
      </div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-primary-light w-7 h-7 z-1 flex items-center justify-center rounded-full cursor-pointer md:hidden"
      >
        <Image src={"/icon/arrow.svg"} alt="notification-icon" width={18} height={18} className={`${open && "transform transition-transform duration-300 ease-linear"}`} />
      </button>
    </div>
  )
};

export default ModalAction;
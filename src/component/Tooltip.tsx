'use client';

import { ReactNode, useState } from "react";

interface TooltipProps {
  content: ReactNode,
  children: ReactNode,
}

const Tooltip = (
  { content, children }: TooltipProps
) => {

  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-10 px-2 py-1 w-60 h-fit bg-white rounded shadow-lg bottom-full mb-2 right-0">
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip;
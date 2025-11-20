"use client";

import { ButtonPdfDownloadProps } from "@/lib/types/pdftype";


const ButtonPdfDownload = ({ id, type, children }: ButtonPdfDownloadProps) => {
  return (
    <a
      href={`/api/pdf?u=${id}&type=${type}`}
      download
      target="_blank"
      rel="noopener noreferrer"
    >
      {children ? children : "Export .pdf"}
    </a>
  )
}

export default ButtonPdfDownload;
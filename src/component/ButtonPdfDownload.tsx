"use client";

import { ButtonPdfDownloadProps } from "@/lib/types/pdftype";


const ButtonPdfDownload = ({ id, fileType, type, children }: ButtonPdfDownloadProps) => {
  return (
    <a
      href={`/api/${fileType}?u=${id}&type=${type}`}
      download
      target="_blank"
      rel="noopener noreferrer"
    >
      {children ? children : "Export"}
    </a>
  )
}

export default ButtonPdfDownload;
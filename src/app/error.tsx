// Error boundaries must be Client Components
'use client'
import Image from "next/image"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [])
  return (
    <div className="flex flex-col w-full min-h-screen items-center md:justify-center bg-accent-light/50">
      <Image src={'/global-error.png'} alt="global-error-pic" width={500} height={500} className="mt-4 md:mt-0" />
      <h2 className="font-bold text-xl md:text-3xl text-orange-600/70 text-shadow-sm">Oops! Terjadi kesalahan...</h2>
      <div className="flex flex-col items-center mt-4">
        <p className="text-gray-400 font-medium mb-1 ">Perbaikan akan segera dilakukan.</p>
        <p className="text-gray-400 font-medium mb-1 ">Coba beberapa saat lagi.</p>
        {/* <p className="text-gray-400 font-medium mb-1 ">{error.toString()}</p> */}
      </div>
      <button
        onClick={() => reset()}
        className="mt-4 font-semibold text-orange-600 px-4 py-2.5 flex gap-2 items-center cursor-pointer bg-orange-200/40 hover:bg-orange-200/80 rounded-lg"
      >
        <Image src={'/icon/reload.svg'} alt="reload-icon" width={20} height={20} />
        Refresh Page
      </button>
      {/* <Link
            href={"/admin"}
            className="text-sm mt-2 text-gray-400"
          >
            Kembali ke dashboard
          </Link> */}
    </div>
  )
}
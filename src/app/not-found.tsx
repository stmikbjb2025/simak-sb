import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0 flex flex-col items-center'>
      <div className="relative flex items-center justify-center mt-8">
        <Image
          src="/not-found.png"
          width={260}
          height={200}
          alt="submit complete illustration"
        />
      </div>
      <div>
        <h2 className="font-bold text-xl md:text-3xl text-orange-600/70 text-shadow-sm">Oops! Something Missing...</h2>
        <div className="flex flex-col items-center mt-4">
          <p className="text-gray-400 font-medium mb-1 ">Halaman tidak dapat ditemukan.</p>
          {/* <p className="text-gray-400 font-medium mb-1 ">Silakan kembali ke halaman utama.</p> */}
          <Link
            href={"/admin"}
            className="px-2 py-2 rounded-sm font-medium text-sm mt-2 bg-gray-900 text-gray-50 hover:bg-gray-300 hover:text-gray-900"
          >
            Kembali ke dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
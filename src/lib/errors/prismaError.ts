import { Prisma } from "@/generated/prisma/client";
import { AppError } from "./appErrors";

export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const code = error.code;

    switch (code) {
      case "P2002":
        if (Array.isArray(error.meta?.target) && (error.meta?.target as string[]).includes("name")) {
          throw new AppError(
            "Data sudah ada dan tidak boleh duplikat.",
            400
          );
        }
        if (Array.isArray(error.meta?.target) && (error.meta?.target as string[]).includes("email")) {
          throw new AppError(
            "Email sudah ada dan tidak boleh duplikat.",
            400
          );
        }
        if (Array.isArray(error.meta?.target) && (error.meta?.target as string[]).includes("numberCode")) {
          throw new AppError(
            "Kode angka sudah ada dan tidak boleh duplikat.",
            400
          );
        }
        if (Array.isArray(error.meta?.target) && (error.meta?.target as string[]).includes("stringCode")) {
          throw new AppError(
            "Kode huruf sudah ada dan tidak boleh duplikat.",
            400
          );
        }
        if (Array.isArray(error.meta?.target) && (error.meta?.target as string[]).includes("nim")) {
          throw new AppError(
            "NIM sudah ada dan tidak boleh duplikat.",
            400
          );
        }
        throw new AppError("Data sudah ada dan tidak boleh duplikat.", 400);

      case "P2003":
        throw new AppError("Data tidak dapat dihapus atau diubah. Hapus relasi data terlebih dahulu", 400);
      
      case "P2025":
        throw new AppError("Data tidak ditemukan. Mungkin sudah dihapus.", 404);

      default:
        throw new AppError("Kesalahan pada database.", 500);
    }
  }

  if (error instanceof AppError) {
    // Fallback jika error bukan dari Prisma
    throw new AppError(error.message || "Terjadi kesalahan tidak diketahui.", error.statusCode);
  }

  throw new AppError("Terjadi kesalahan tidak diketahui.", 500);

}
'use server';

import bcrypt from "bcryptjs";
import { ChangePasswordInputs, LoginInputs } from "./formValidationSchema";
import { prisma } from "./prisma";
import { createSession, deleteSession } from "./session";
import { redirect } from "next/navigation";
import { handlePrismaError } from "./errors/prismaError";
import { AppError } from "./errors/appErrors";
import logger from "./logger";

export const login = async (state: { success: boolean, error: boolean, message: string }, data: LoginInputs) => {
  const user = await prisma.user.findUnique({
    where: { email: data.username },
  });
  if (!user) return { success: false, error: true, message: "username dan password salah" };
  if (!user?.isStatus) return { success: false, error: true, message: "akun user tidak aktif" };

  const checkPassword = await bcrypt.compare(data.password, user?.password as string);
  if (!checkPassword) return { success: false, error: true, message: "username dan password salah" };

  // set session
  const session = await createSession(user.id);
  if (!session) return { success: false, error: true, message: "gagal membuat session" };

  return { success: true, error: false, message: "login sukses" };
}

export const logout = async () => {
  await deleteSession();
  redirect('/')
}

export const changePassword = async (state: { success: boolean, error: boolean, message: string }, data: ChangePasswordInputs) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) throw new AppError("User tidak ditemukan");

    const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);
    if (!isPasswordValid) throw new AppError("Password lama tidak sesuai");
    if (data.newPassword !== data.confirmPassword) throw new AppError("Password baru dan konfirmasi password tidak sesuai");
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: {
        email: data.email,
      },
      data: {
        password: hashedPassword,
      }
    })
    return { success: true, error: false, message: "berhasil ganti password" };
  } catch (err) {
    logger.error(err);
    try {
      handlePrismaError(err)
    } catch (error) {
      if (error instanceof AppError) {
        return { success: false, error: true, message: error.message };
      } else {
        return { success: false, error: true, message: "Terjadi kesalahan tidak diketahui." }
      }
    }
  }
}
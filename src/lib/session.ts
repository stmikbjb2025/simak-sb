'use server';
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "./prisma";
import { cookies } from "next/headers";

const SESSION_NAME = "session";

const encrypt = async (sessionId: string) => {
  const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
  const jwt = await new SignJWT({ sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2d")
    .sign(secret);
  return jwt;
}

export const decrypt = async (token: string) => {
  if (!token) return null;
  const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });
  
  return payload.sessionId;
}

export const createSession = async (userId: string) => {
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  let session;
  const sessionCheck = await prisma.session.findFirst({
    where: { userId: userId }
  });
  if (sessionCheck) {
    session = await prisma.session.update({
      where: {
        id: sessionCheck.id,
      },
      data: {
        expiresAt: expiresAt,
      }
    })
  } else {
    session = await prisma.session.create({
      data: {
        userId: userId,
        expiresAt: expiresAt,
      }
    })
  }
  const sessionId = session.id;
  const encryptedSession = await encrypt(sessionId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_NAME, encryptedSession, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    path: "/",
    sameSite: "lax",
  });

  return true;
}

export const getSession = async () => {
  // Get session from cookie
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_NAME)?.value || "";
  const decryptedSession = await decrypt(session);

  if (!session || !decryptedSession) return null;

  // Get session from database
  const sessionData = await prisma.session.findUnique({
    where: { id: decryptedSession.toString() },
    include: {
      user: {
        include: {
          role: true,
        }
      }
    },
  });

  if (!sessionData || sessionData.expiresAt.getTime() < Date.now()) return null;
  return {
    sessionId: sessionData.id,
    userId: sessionData.userId,
    roleId: sessionData.user.roleId,
    roleName: sessionData.user.role?.name,
    roleType: sessionData.user.role?.roleType,
  };
}

export const deleteSession = async () => {
  const cookieStore = await cookies();
  
  const session = await getSession();
  if (!session) return null;
  await prisma.session.delete({
    where: {id: session?.sessionId}
  })
  cookieStore.delete(SESSION_NAME);
  return true;
}
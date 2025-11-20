'use server';
import { prisma } from "./prisma";
import { getSession } from "./session"
import { Permission, RolePermission } from "@/generated/prisma/client";

type PermissionDataType = RolePermission & {permission: Permission};

export const getSidebarItemsByRole = async () => {
  const getSessionData = await getSession();
  if (!getSessionData) return null;

  const permissionByRole = await prisma.rolePermission.findMany({
    where: {
      roleId: getSessionData.roleId!,
    },
    include: {
      permission: true,
    },
  });
  const viewPermission = permissionByRole
    .map((permission:PermissionDataType) => permission?.permission?.name)
    .filter((permissionName: string) => permissionName?.startsWith('view:'))
    .map((pathname: string) => pathname?.split(':')[1]);
  
  return viewPermission
  
}

export const canRoleCreateData = async (pathname: string) => {
  const getSessionData = await getSession();
  if (!getSessionData) return null;
  const permissionByRole = await prisma.rolePermission.findMany({
    where: {
      roleId: getSessionData.roleId!,
    },
    include: {
      permission: true,
    },
  });

  const createPermission = permissionByRole
    .map((permission: PermissionDataType) => permission?.permission?.name)
    .filter((permissionName: string) => permissionName?.startsWith('create:'))
    .map((pathname: string) => pathname?.split(':')[1]);
  
  return createPermission.includes(pathname);
};

export const canRoleCreateDataUser = async () => {
  const getSessionData = await getSession();
  if (!getSessionData) return null;
  const permissionByRole = await prisma.rolePermission.findMany({
    where: {
      roleId: getSessionData.roleId!,
    },
    include: {
      permission: true,
    },
  });

  const createUserPermission = permissionByRole
    .map((permission: PermissionDataType) => permission?.permission?.name)
    .filter((permissionName: string) => permissionName?.includes('users') && permissionName?.includes('create:'))
  
  return createUserPermission.length > 0 ? true : false;
}

export const canRoleViewData = async (pathname: string) => {
  const getSessionData = await getSession();
  if (!getSessionData) return null;
  const permissionByRole = await prisma.rolePermission.findMany({
    where: {
      roleId: getSessionData.roleId!,
    },
    include: {
      permission: true,
    },
  });

  const viewPermission = permissionByRole
    .map((permission: PermissionDataType) => permission?.permission?.name)
    .filter((permissionName: string) => permissionName?.startsWith('view:'))
    .map((pathname: string) => pathname?.split(':')[1]);
  
  return viewPermission.includes(pathname);
};
export const canRoleUpdateData = async (pathname: string) => {
  const getSessionData = await getSession();
  if (!getSessionData) return null;
  const permissionByRole = await prisma.rolePermission.findMany({
    where: {
      roleId: getSessionData.roleId!,
    },
    include: {
      permission: true,
    },
  });

  const updatePermission = permissionByRole
    .map((permission: PermissionDataType) => permission?.permission?.name)
    .filter((permissionName: string) => permissionName?.startsWith('edit:'))
    .map((pathname: string) => pathname?.split(':')[1]);
  
  return updatePermission.includes(pathname);
};
export const canRoleDeleteData = async (pathname: string) => {
  const getSessionData = await getSession();
  if (!getSessionData) return null;
  const permissionByRole = await prisma.rolePermission.findMany({
    where: {
      roleId: getSessionData.roleId!,
    },
    include: {
      permission: true,
    },
  });

  const deletePermission = permissionByRole
    .map((permission: PermissionDataType) => permission?.permission?.name)
    .filter((permissionName: string) => permissionName?.startsWith('delete:'))
    .map((pathname: string) => pathname?.split(':')[1]);
  
  return deletePermission.includes(pathname);
};
export const redirectDashboardByRole = async () => {
  const getSessionData = await getSession();
  if (!getSessionData) return null;
  const roleType = getSessionData.roleType;
  switch (roleType) {
    case "OPERATOR":
      return "admin";
    case "LECTURER":
      return "lecturer";
    case "ADVISOR":
      return "lecturer";
    case "STUDENT":
      return "student";
    default:
      return null;
  }
}
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function TranskipLayout({
  student, operator, advisor
}: Readonly<{
  student: React.ReactNode;
  operator: React.ReactNode;
  advisor: React.ReactNode;
}>) {
  const getSessionFunc = await getSession();
  if (!getSessionFunc) {
    redirect("/sign-in")
  }

  const role = getSessionFunc.roleType;
  return (
    <div>
      {(role === "OPERATOR" && operator) || (role === "STUDENT" && student) || advisor}
    </div>

  );
}
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  student, operator, lecturer
}: Readonly<{
  student: React.ReactNode;
  operator: React.ReactNode;
  lecturer: React.ReactNode;
}>) {
  const getSessionFunc = await getSession();
  if (!getSessionFunc) {
    redirect("/sign-in")
  }

  const role = getSessionFunc.roleType;
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="bg-white p-4 rounded-xl flex-1 mt-0 ">
        <h1 className="text-xl font-semibold">Profil Pengguna</h1>
      </div>
      {(role === "OPERATOR" && operator) || (role === "STUDENT" && student) || lecturer}
    </div>
  );
}
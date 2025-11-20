import ChangePasswordForm from "@/component/forms/ChangePasswordForm";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const SettingPage = async () => {
  const session = await getSession();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.userId,
    }
  });
  return (
    <div className="flex items-center justify-center mt-4">
      <ChangePasswordForm data={user} />
    </div>
  )
}

export default SettingPage;
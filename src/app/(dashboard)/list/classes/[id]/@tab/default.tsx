import { redirect } from "next/navigation";

const DefaultTab = async (
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  redirect(`/list/classes/${id}/student`)
}

export default DefaultTab;
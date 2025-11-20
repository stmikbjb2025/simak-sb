import { redirect } from "next/navigation";

const DefaultTab = () => {
  redirect("/list/schedules/schedule");
}

export default DefaultTab;
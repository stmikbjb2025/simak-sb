import { redirect } from "next/navigation";

const HomePage = async () => {
  redirect("/sign-in");
}

export default HomePage;
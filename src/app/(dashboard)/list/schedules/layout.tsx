import TabNavigation from "@/component/TabNavigationCourse";
import React from "react";

export default async function ScheduleLayout({
  tab,
}: Readonly<{
  tab: React.ReactNode;
}>) {

  const tabs = [
    { href: "/list/schedules/schedule", label: "Jadwal" },
    { href: "/list/schedules/times", label: "Jam Pelajaran" },
  ];

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0">
      <TabNavigation tabs={tabs} />
      <div className="mt-2">{tab}</div>
    </div>
  );
}
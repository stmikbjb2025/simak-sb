import TabNavigation from "@/component/TabNavigationCourse";
import React from "react";

export default async function CourseLayout({
  tab,
}: Readonly<{
  tab: React.ReactNode;
}>) {

  const tabs = [
    { href: "/list/courses/course", label: "Matkul" },
    { href: "/list/courses/assesment", label: "Penilaian" },
    { href: "/list/courses/grade-component", label: "Komponen Nilai" },
  ];

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0">
      <TabNavigation tabs={tabs} />
      <div className="mt-2">{tab}</div>
    </div>
  );
}
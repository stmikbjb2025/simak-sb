import { getSidebarItemsByRole } from "@/lib/dal";
import Sidebar from "./Sidebar";

const menuItems = [
  {
    title: "HAK AKSES",
    items: [
      {
        icon: "/icon/permission.svg",
        label: "Hak Akses",
        href: "/list/permissions",
      },
      {
        icon: "/icon/role.svg",
        label: "Role",
        href: "/list/roles",
      },
    ],
  },
  {
    title: "AKADEMIK",
    items: [
      {
        icon: "/icon/operator.svg",
        label: "Jabatan",
        href: "/list/positions",
      },
      {
        icon: "/icon/period.svg",
        label: "Periode Akademik",
        href: "/list/periods",
      },
      {
        icon: "/icon/reregister.svg",
        label: "Her Registrasi",
        href: "/list/reregistrations",
      },
      {
        icon: "/icon/curriculum.svg",
        label: "Kurikulum",
        href: "/list/curriculums",
      },
      {
        icon: "/icon/setting.svg",
        label: "Pengaturan KRS",
        href: "/list/krsrules",
      },
    ]
  },
  {
    title: "MENU MASTER",
    items: [
      {
        icon: "/icon/lecturer.svg",
        label: "Dosen",
        href: "/list/lecturers",
      },
      {
        icon: "/icon/student.svg",
        label: "Mahasiswa",
        href: "/list/students",
      },
      {
        icon: "/icon/operator.svg",
        label: "Operator",
        href: "/list/operators",
      },
      {
        icon: "/icon/major.svg",
        label: "Program Studi",
        href: "/list/majors",
      },
      {
        icon: "/icon/course.svg",
        label: "Mata Kuliah",
        href: "/list/courses",
      },
      {
        icon: "/icon/room.svg",
        label: "Lokal/Ruangan",
        href: "/list/rooms",
      },

      {
        icon: "/icon/schedule.svg",
        label: "Jadwal",
        href: "/list/schedules",
      },

      {
        icon: "/icon/event.svg",
        label: "Events",
        href: "/list/events",
      },
      {
        icon: "/icon/announcement.svg",
        label: "Announcements",
        href: "/list/announcements",
      },
    ],
  },
  {
    title: "PERKULIAHAN",
    items: [
      {
        icon: "/icon/class.svg",
        label: "Kelas",
        href: "/list/classes",
      },
      {
        icon: "/icon/krs.svg",
        label: "KRS",
        href: "/list/krs",
      },
      {
        icon: "/icon/attendance.svg",
        label: "Presensi",
        href: "/list/presences",
      },
      {
        icon: "/icon/khs.svg",
        label: "KHS",
        href: "/list/khs",
      },
      {
        icon: "/icon/transkip.svg",
        label: "Transkip",
        href: "/list/transcripts",
      },
    ],
  },
  {
    title: "LAPORAN",
    items: [
      {
        icon: "/icon/recap.svg",
        label: "Rekapitulasi",
        href: "/list/recapitulations",
      },
    ],
  }
];

const SidebarContainer = async () => {
  const getMenuSidebarByRole = await getSidebarItemsByRole();
  if (!getMenuSidebarByRole) return null;

  const filteredMenuItems = menuItems.map((menu) => {
    return {
      ...menu,
      items: menu.items.filter((item) =>
        getMenuSidebarByRole.includes(item.href.split("/")[2])
      ),
    };
  });

  return (
    <>
      <Sidebar menuItems={filteredMenuItems} />
    </>
  )
}

export default SidebarContainer;
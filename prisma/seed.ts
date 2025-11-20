import bcrypt from "bcryptjs";
import { PrismaClient, RoleType } from "@/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Permission
  const permissionData = [
    { pathname: "periods", name: "period", nama: "periode" },
    { pathname: "permissions", name: "permission", nama: "hak akses" },
    { pathname: "roles", name: "role", nama: "role" },
    { pathname: "krsrules", name: "krsrule", nama: "pengaturan krs" },
    { pathname: "users", name: "user", nama: "pengguna" },
    { pathname: "lecturers", name: "lecturer", nama: "dosen" },
    { pathname: "students", name: "student", nama: "mahasiswa" },
    { pathname: "operators", name: "operator", nama: "operator" },
    { pathname: "positions", name: "position", nama: "jabatan" },
    { pathname: "majors", name: "major", nama: "program studi" },
    { pathname: "reregistrations", name: "reregistration", nama: "herregistrasi" },
    { pathname: "curriculums", name: "curruculum", nama: "kurikulum" },
    { pathname: "courses", name: "course", nama: "mata kuliah" },
    { pathname: "rooms", name: "room", nama: "ruangan" },
    { pathname: "krs", name: "krs", nama: "krs" },
    { pathname: "schedules", name: "schedule", nama: "jadwal" },
    { pathname: "classes", name: "class", nama: "kelas" },
    { pathname: "khs", name: "khs", nama: "khs" },
    { pathname: "presences", name: "presence", nama: "presensi" },
    { pathname: "transcripts", name: "transcript", nama: "transkip" },
    { pathname: "events", name: "event", nama: "event" },
    { pathname: "announcements", name: "announcements", nama: "pengumuman" },
    { pathname: "recapitulations", name: "recapitulation", nama: "rekapitulasi" },
  ];
  const action = ["view", "create", "edit", "delete"];
  for (const resource of permissionData) {
    for (const act of action) {
      await prisma.permission.create({
        data: {
          name: `${act}:${resource.pathname}`,
          description: `${act}:${resource.nama}`
        }
      })
    }
  }
  
  const roleName = ["admin", "dosen", "perwalian akademik", "finance", "akademik", "mahasiswa"]

  for (const element of roleName) {
    await prisma.role.create({
      data: {
        name: element,
        description: element,
        roleType: (element === "dosen" && "LECTURER") || (element === "mahasiswa" && "STUDENT") ||
          (element === "perwalian akademik" && "ADVISOR") || (element === "admin" && "OPERATOR") ||
          (element === "finance" && "OPERATOR") || (element === "akademik" && "OPERATOR") as RoleType,
      }
    })
  }

  const permissions = await prisma.permission.count();

  for (let i = 1; i <= permissions; i++) {
    await prisma.rolePermission.create({
      data: {
        roleId: 1,
        permissionId: i,
      }
    })
  };

  await prisma.operator.create({
    data: {
      name: "super admin",
      department: "admin",
      user: {
        create: {
          email: "admin1@stmik.com",
          password: bcrypt.hashSync("admin", 10),
          roleId: 1,
          isStatus: true,
        }
      }
    }
  })
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
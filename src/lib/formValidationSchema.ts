import { literal, z } from "zod";

export const permissionSchema = z.object({
  id: z.coerce.number().optional(),
  action: z.string().min(1, { message: "pilih aksi yang diinginkan!" }),
  resource: z.string().min(1, { message: "pilih modul/domain yang diinginkan!" }),
  description: z.string().optional(),
})

export type PermissionInputs = z.infer<typeof permissionSchema>;

export const roleSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Nama role harus diisi!" }),
  description: z.string().optional(),
  roleType: z.enum(["OPERATOR", "LECTURER", "STUDENT", "ADVISOR"], {message: "tipe role harus dipilih"}),
  rolePermission: z.array(z.coerce.number()).min(1, { message: "Hak akses harus dipilih!" }), //ids permission
})

export type RoleInputs = z.infer<typeof roleSchema>;

export const rolePermissionSchema = z.object({
  roleId: z.coerce.number(),
  roleName: z.string(),
  roleDescription: z.string().optional(),
  permission: z.coerce.number(), //ids permission
})

export type RolePermissionInputs = z.infer<typeof rolePermissionSchema>;

export const majorSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, {message: "nama program studi harus diisi"}),
  numberCode: z.coerce.number().min(1, {message: "kode angka program studi harus diisi"}),
  stringCode: z.string().min(1, {message: "kode program studi harus diisi"}),
})

export type MajorInputs = z.infer<typeof majorSchema>;

export const roomSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, {message: "ruang/lokal harus diisi"}),
  location: z.enum(["BJB", "BJM"], {message: "lokasi ruang/lokal harus diisi"}),
  capacity: z.coerce.number().min(1, {message: "kapasitas ruang/lokal harus diisi"}),
})

export type RoomInputs = z.infer<typeof roomSchema>;

export const courseSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, {message: "kode mata kuliah harus diisi"}),
  name: z.string().min(1, {message: "nama mata kuliah harus diisi"}),
  sks: z.coerce.number().min(1, { message: "sks harus diisi" }),
  predecessorId: z.string().optional(),
  isPKL: z.boolean().default(false),
  isSkripsi: z.boolean().default(false),
  courseType: z.string().min(1, {message: "kategori mata kuliah harus diisi"}),
  majorId: z.coerce.number().min(1, { message: "program studi harus diisi" }),
  assessmentId: z.string().min(1, { message: "bentuk penilaian harus diisi" }),
})

export type CourseInputs = z.infer<typeof courseSchema>;

export const userSchema = z.object({
  id: z.string().optional(),
  username: z.string().email({ message: "email tidak valid" }).min(5, { message: "email harus diisi" }).trim(),
  password: z.string().min(5, { message: "password minimal 5 karakter" }),
  roleId: z.number().min(1, { message: "role pengguna harus diisi" }),
  isStatus: z.boolean().default(false)
})

export type UserInputs = z.infer<typeof userSchema>;

export const lecturerSchema = z.object({
  id: z.string().optional(),
  npk: z.string().min(1, { message: "NPK harus diisi" }),
  nidn: z.string().min(1, {message: "NIDN harus diisi"}),
  nuptk: z.string().length(16, {message: "NUPTK harus 16 digit"}).optional().or(z.literal("")),
  name: z.string().min(1, { message: "nama dosen harus diisi" }),
  frontTitle: z.string().optional(),
  backTitle: z.string().optional(),
  degree: z.enum(["S1", "S2", "S3"], { message: "Pilih Pendidikan terakhir" }),
  year: z.coerce.number().min(4, {message: "tahun masuk harus diisi"}),
  address: z.string().optional(),
  gender: z.enum(["PRIA", "WANITA"], { message: "Pilih Gender" }),
  religion: z.enum(["ISLAM", "KATOLIK", "PROTESTAN", "BUDDHA", "HINDU", "KONGHUCU", "DLL"], {message: "Pilih agama"}),
  majorId: z.coerce.number().min(1, { message: "Pilih program studi " }),
  email: z.string().email({ message: "email tidak valid" }).optional().or(z.literal("")),
  hp: z.string().optional(),
  photo: z.string().optional().or(z.literal("")),
})

export type LecturerInputs = z.infer<typeof lecturerSchema>;

export const operatorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "nama operator harus diisi" }),
  department: z.string().optional(),
})

export type OperatorInputs = z.infer<typeof operatorSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  // information data student
  nim: z.string().length(12, {message: "NIM harus diisi"}),
  name: z.string().min(1, { message: "nama mahasiswa harus diisi" }),
  year: z.coerce.number().min(4, { message: "tahun terdaftar harus diisi" }),
  religion: z.enum(["ISLAM", "KATOLIK", "PROTESTAN", "BUDDHA", "HINDU", "KONGHUCU", "DLL"], {message: "Pilih agama"}),
  gender: z.enum(["PRIA", "WANITA"], { message: "Pilih gender" }),
  address: z.string().optional(),
  domicile: z.string().optional(),
  email: z.string().email({ message: "email tidak valid" }).optional().or(z.literal("")),
  phone: z.string().optional(),
  majorId: z.coerce.number().min(1, { message: "Pilih program studi" }),
  lecturerId: z.string().min(1, { message: "Perwalian akademik harus diisi" }),
  studentStatus: z.enum(["NONAKTIF", "AKTIF", "CUTI", "DO", "MENGUNDURKAN_DIRI", "LULUS"], {message: "Pilih status mahasiswa"}),
  statusRegister: z.string().min(1, {message: "Pilih status registrasi"}),
  guardianName: z.string().optional(),
  guardianNIK: z.string().optional(),
  guardianJob: z.string().optional(),
  guardianHp: z.string().optional(),
  guardianAddress: z.string().optional(),
  motherName: z.string().optional(),
  motherNIK: z.string().optional(),
  placeOfBirth: z.string().optional(),
  birthday: z.string().optional(),
  photo: z.string().optional().or(literal("")),
  
})

export type StudentInputs = z.infer<typeof studentSchema>;

export const loginSchema = z.object({
  username: z.string().email({ message: "email tidak valid" }).min(1, { message: "email harus diisi" }),
  password: z.string().min(1, { message: "password harus diisi" }),
})

export type LoginInputs = z.infer<typeof loginSchema>;

export const changePasswordSchema = z.object({
  email: z.string().min(1, { message: "email harus diisi" }),
  oldPassword: z.string().min(1, { message: "password lama harus diisi" }),
  newPassword: z.string().min(5, { message: "password minimal 5 karakter" }),
  confirmPassword: z.string().min(5, { message: "password minimal 5 karakter" }),
})

export type ChangePasswordInputs = z.infer<typeof changePasswordSchema>;

export const periodSchema = z.object({
  id: z.string().optional(),
  year: z.string().min(1, { message: "tahun akademik harus diisi" }),
  semesterType: z.enum(["GANJIL", "GENAP"], { message: "tipe semester harus diisi" }),
  isActive: z.boolean().default(false),
})

export type PeriodInputs = z.infer<typeof periodSchema>;

export const reregistrationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "nama herregistrasi harus diisi" }),
  periodId: z.string().min(1, { message: "periode akademik harus diisi" }),
  isReregisterActive: z.boolean().default(false),
})

export type ReregistrationInputs = z.infer<typeof reregistrationSchema>;

export const reregistrationCreateAllSchema = z.object({
  id: z.string().optional(),
})

export type ReregistrationCreateAllInputs = z.infer<typeof reregistrationCreateAllSchema>;

export const reregistrationDetailSchema = z.object({
  reregisterId: z.string().min(1, {message: "id Herregister harus diisi"}),
  studentId: z.string().min(1, {message: "pilih mahasiswa"}),
  semester: z.string().min(1, {message: "semester harus diisi"}),
  year: z.coerce.number().min(4, {message: "Tahun masuk/angkatan harus diisi"}),
  major: z.string().min(1, {message: "Pilih program studi"}),
  lecturerId: z.string().min(1, {message: "Pilih perwalian akademik"}),
  campusType: z.string().default("BJB"),
  nominal: z.coerce.number().optional(),
  paymentReceiptFile: z.string().optional().or(z.literal("")),
  paymentStatus: z.string().default("BELUM_LUNAS"),
  semesterStatus: z.string().default("NONAKTIF"),
  paymentDescription: z.string().optional(),
  placeOfBirth: z.string().optional(),
  birthday: z.string().optional(),
  domicile: z.string().optional(),
  address: z.string().optional(),
  hp: z.string().optional(),
  email: z.string().optional(),
  guardianName: z.string().optional(),
  guardianNIK: z.string().optional(),
  guardianJob: z.string().optional(),
  guardianHp: z.string().optional(),
  guardianAddress: z.string().optional(),
  motherName: z.string().optional(),
  motherNIK: z.string().optional(),
})

export type ReregistrationDetailInputs = z.infer<typeof reregistrationDetailSchema>;

export const reregistrationStudentSchema = z.object({
  reregisterId: z.string().min(1, {message: "id Herregister harus diisi"}),
  studentId: z.string().min(1, { message: "pilih mahasiswa" }),
  nim: z.string().optional(),
  name: z.string().optional(),
  semester: z.string().optional(),
  year: z.string().min(4, {message: "Tahun masuk/angkatan harus diisi"}),
  major: z.string().min(1, {message: "Pilih program studi"}),
  lecturerId: z.string().min(1, {message: "Pilih perwalian akademik"}),
  campusType: z.string().default("BJB"),
  placeOfBirth: z.string().min(1, {message: "Tempat lahir harus diisi"}),
  birthday: z.string().min(1, {message: "Tanggal lahir harus diisi"}),
  domicile: z.string().min(1, {message: "Alamat asal/domisili harus diisi"}),
  address: z.string().min(1, {message: "Alamat sekarang harus diisi"}),
  hp: z.string().min(1, {message: "No. Telp/HP harus diisi"}),
  email: z.string().min(1, {message: "email harus diisi"}),
  guardianName: z.string().min(1, {message: "nama orang tua/wali harus diisi"}),
  guardianNIK: z.string().min(1, {message: "NIK orang tua/wali harus diisi"}),
  guardianJob: z.string().min(1, {message: "pekerjaan orang tua/wali harus diisi"}),
  guardianHp: z.string().min(1, {message: "No. Telp/HP orang tua/wali harus diisi"}),
  guardianAddress: z.string().min(1, {message: "alamat orang tua/wali harus diisi"}),
  motherName: z.string().min(1, {message: "nama gadis ibu kandung harus diisi"}),
  motherNIK: z.string().min(1, {message: "NIK ibu kandung harus diisi"}),
})

export type ReregistrationStudentInputs = z.infer<typeof reregistrationStudentSchema>;

export const curriculumSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "nama kurikulum harus diisi" }),
  majorId: z.coerce.number().min(1, { message: "program studi harus diisi" }),
  startDate: z.string().min(1, { message: "tanggal mulai harus diisi" }),
  endDate: z.string().min(1, { message: "tanggal selesai harus diisi" }),
  isActive: z.boolean().default(false),
})

export type CurriculumInputs = z.infer<typeof curriculumSchema>;

export const curriculumDetailSchema = z.object({
  id: z.string().optional(),
  curriculumId: z.string().min(1, { message: "Id Kurikulum harus ada" }),
  courseId: z.array(z.string()).min(1, { message: "pilih mata kuliah" }),
  // courseId: z.string().min(1, { message: "pilih mata kuliah" }),
  semester: z.coerce.number().min(1, { message: "semester harus diisi" }),
})

export type CurriculumDetailInputs = z.infer<typeof curriculumDetailSchema>;

export const gradeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Nama komponen nilai harus diisi" }),
  acronym: z.string().min(1, { message: "Akronim komponen nilai harus diisi" }),
})

export type GradeInputs = z.infer<typeof gradeSchema>;

export const assessmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Nama penilaian harus diisi" }),
  gradeComponents: z.array(
    z.object({
      id: z.string().min(1, { message: "komponen nilai harus diisi" }),
      percentage: z.coerce.number().min(1, { message: "persentase harus dari 1 sampai 100 %" }).max(100, { message: "persentase harus dari 1 sampai 100 %" }),
    }))
    .min(1, "Pilih minimal satu komponen nilai")
    .superRefine((components, ctx) => {
      // Cek duplikat ID
      const seen = new Map<string, number[]>();
      components.forEach((c, index) => {
        if (!seen.has(c.id)) {
          seen.set(c.id, []);
        }
        seen.get(c.id)!.push(index);
      });

      for (const [, indices] of seen.entries()) {
        if (indices.length > 1) {
          indices.forEach((i) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Komponen nilai tidak boleh duplikat",
              path: [i, "id"],
            });
          });
        }
      }

      // Cek total persentase
      const total = components.reduce((sum, c) => sum + c.percentage, 0);
      if (total !== 100) {
        components.forEach((_, i) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Total persentase harus 100%",
            path: [i, "percentage"],
          });
        });
      }
    })
})

export type AssessmentInputs = z.infer<typeof assessmentSchema>;

export const CourseInKrsSchema = z.object({
  id: z.string(),
  maxSks: z.coerce.number().optional(),
  course: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
      sks: z.coerce.number(),
      semester: z.coerce.number(),
    })
  )
})
.superRefine((data, ctx) => {
  const maxSks = data.maxSks ?? Infinity
  const totalSks = data.course.reduce((sum, c) => sum + (c.sks ?? 0), 0)
  if (totalSks > maxSks) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Total SKS melebihi batas maksimum SKS yang dapat diambil!`,
      path: ['course'], // bisa juga gunakan [] jika ingin error global
    })
  }
})

export type CourseInKrsInputs = z.infer<typeof CourseInKrsSchema>;

export const positionSchema = z.object({
  id: z.string().optional(),
  positionName: z.string().min(1, { message: "Nama jabatan harus diisi" }),
  personName: z.string().min(1, { message: "Nama lengkap harus diisi" }),
})

export type PositionInputs = z.infer<typeof positionSchema>;

export const classSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Nama kelas harus diisi" }),
  courseId: z.string().min(1, { message: "Pilih mata kuliah" }),
  participants: z.coerce.number().optional(),
  roomId: z.coerce.number().min(1, { message: "Pilih ruang/lokal" }),
  lecturerId: z.string().min(1, { message: "Pilih dosen pengampu" }),
  periodId: z.string().min(1, { message: "Pilih periode akademik" }),
  major: z.string().optional(),
  semester: z.coerce.number().min(1, { message: "Pilih mata kuliah untuk mengisi semester" }),
});

export type ClassInputs = z.infer<typeof classSchema>;

export const timeSchema = z.object({
  id: z.string().optional(),
  timeStart: z.string().time({ message: "Waktu mulai harus dalam format HH:mm" }),
  timeFinish: z.string().time({ message: "Waktu selesai harus dalam format HH:mm" }),
}).refine((data) => data.timeStart < data.timeFinish, {
  message: "Waktu selesai harus lebih dari waktu mulai",
  path: ["timeFinish"]
})

export type TimeInputs = z.infer<typeof timeSchema>;

export const scheduleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "nama jadwal harus diisi" }),
  periodId: z.string().min(1, { message: "periode akademik harus diisi" }),
  isActive: z.boolean().default(false),
})

export type ScheduleInputs = z.infer<typeof scheduleSchema>;

export const scheduleDetailSchema = z.object({
  id: z.string().optional(),
  scheduleId: z.string().min(1, { message: "Schedule ID tidak ditemukan!" }),
  academicClass: z.string().min(1, { message: "kelas harus diisi" }),
  time: z.string().min(1, { message: "waktu pelajaran harus diisi" }),
  dayName: z.string().min(1, { message: "Hari harus diisi" })
})

export type ScheduleDetailInputs = z.infer<typeof scheduleDetailSchema>;

export const academicClassDetailSchema = z.object({
  classId: z.string().optional(),
  students: z.array(z.string().min(1, {message: "Pilih mahasiswa"})),
})

export type AcademicClassDetailInputs = z.infer<typeof academicClassDetailSchema>;

export const presenceSchema = z.object({
  id: z.string().optional(),
  academicClassId: z.string().min(1, { message: "kelas tidak ditemukan" }),
  academicClass: z.string().optional(),
  weekNumber: z.coerce.number().min(1, {message: "Pertemuan harus diisi"}),
  date: z.string().min(1, {message: "Tanggal Perkuliahan harus diisi"}),
  duration: z.string().min(1, {message: "durasi perkuliahan harus diisi"}),
  learningMethod: z.array(z.string()).min(1, {message: "Metode Perkuliahan harus diisi"}),
  lesson: z.string().min(1, {message: "Pokok bahasan harus diisi"}),
  lessonDetail: z.string().min(1, { message: "Sub-pokok bahasan harus diisi" }),
})

export type PresenceInputs = z.infer<typeof presenceSchema>;

export const presenceActivationSchema = z.object({
  id: z.string().optional(),
  academicClassId: z.string().min(1, { message: "kelas tidak ditemukan" }),
  academicClass: z.string().optional(),
  isActive: z.boolean().default(false),
  durationPresence: z.string().min(1, {message: "Pilih durasi presensi diaktifkan"}),
})

export type PresenceActivationInputs = z.infer<typeof presenceActivationSchema>;

export const presenceAllSchema = z.object({
  presenceId: z.string().min(1, { message: "Pilih pertemuan" }),
})

export type PresenceAllInputs = z.infer<typeof presenceAllSchema>;

export const khsGradeSchema = z.object({
  id: z.string().optional(),
  studentName: z.string().optional(),
  studentNIM: z.string().optional(),
  finalScore: z.coerce.number().min(0, { message: "Nilai akhir harus diisi" }),
  gradeLetter: z.string().optional(),
  weight: z.coerce.number().optional(),
  khsGrade: z.array(
    z.object({
      id: z.string().min(1, { message: "Krs Grade ID tidak ditemukan" }),
      assessmentDetailId: z.string().optional(),
      khsDetailId: z.string().optional(),
      assessmentDetail: z.object({
        id: z.string().optional(),
        grade: z.object({
          id: z.string().optional(),
          name: z.string().optional(),
        }),
      }),
      percentage: z.coerce.number().min(0, { message: "Persentase harus diisi" }).max(100, { message: "Persentase tidak boleh lebih dari 100%" }),
      score: z.coerce.number().min(0, { message: "Nilai harus diisi" }).max(100, { message: "Nilai tidak boleh lebih dari 100" }),
    })
  )
})
export type KhsGradeInputs = z.infer<typeof khsGradeSchema>;

export const RplSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  periodId: z.string(),
  khsDetail: z.array(
    z.object({
      id: z.string().min(1, { message: "komponen nilai harus diisi" }),
      gradeLetter: z.string(),
      weight: z.coerce.number().min(0, { message: "Nilai harus diisi" }),
    })
  ).min(1, "Pilih minimal satu mata kuliah")
  .superRefine((components, ctx) => {
      // Cek duplikat ID
      const seen = new Map<string, number[]>();
      components.forEach((c, index) => {
        if (!seen.has(c.id)) {
          seen.set(c.id, []);
        }
        seen.get(c.id)!.push(index);
      });

      for (const [, indices] of seen.entries()) {
        if (indices.length > 1) {
          indices.forEach((i) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Mata kuliah tidak boleh duplikat",
              path: [i, "id"],
            });
          });
        }
      }
    })
});
export type RplInputs = z.infer<typeof RplSchema>

export const krsOverride = z.object({
  id: z.string().optional(),
  krsId: z.string().min(1, { message: "KRS ID tidak ditemukan" }),
  ips_allowed: z.coerce.number().min(0, { message: "IP yang diizinkan harus diisi" }),
  sks_allowed: z.coerce.number().min(0, { message: "IP yang diizinkan harus diisi" }),
})
export type KrsOverrideInputs = z.infer<typeof krsOverride>

export const khsGradeRevisionSchema = z.object({
  id: z.string().optional(),
  khsId: z.string(),
  courseId: z.string(),
  studentName: z.string(),
  studentNIM: z.string(),
  finalScore: z.coerce.number(),
  gradeLetter: z.string(),
  weight: z.coerce.number(),
  khsGrade: z.array(
    z.object({
      assessmentDetailId: z.string(),
      assessmentDetail: z.object({
        id: z.string(),
        grade: z.object({
          id: z.string(),
          name: z.string(),
        }),
      }),
      percentage: z.coerce.number(),
      score: z.coerce.number(),
    })
  )
})
export type KhsGradeRevisionInputs = z.infer<typeof khsGradeRevisionSchema>;

export const krsRulesSchema = z.object({
  id: z.string().optional(),
  statusRegister: z.string().min(1, { message: "Status register harus dipilih" }),
  semester: z.coerce.number().min(1, { message: "minimum semester 1" }).max(14, { message: "maksimum tidak boleh lebih dari 14" }),
  maxSks: z.coerce.number().min(0, { message: "maxSks harus diisi. default 0" }),
  autoPackage: z.boolean().default(false),
  allowManualSelection: z.boolean().default(false),
  isActive: z.boolean().default(false),
})

export type KrsRulesInputs = z.infer<typeof krsRulesSchema>;

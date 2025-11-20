export const ITEM_PER_PAGE = 10;

export const resourceData = [
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
  { pathname: "attendances", name: "attendance", nama: "presensi" },
  { pathname: "transcripts", name: "transcript", nama: "transkip" },
  { pathname: "events", name: "event", nama: "event" },
  { pathname: "recapitulations", name: "recapitulation", nama: "rekapitulasi" },
];
export const actionPermission = ["view", "create", "edit", "delete"];

export const StatusRegister = [
  "BARU",
  "TRANSFER_KREDIT",
  "RENIM",
  "PEROLEHAN_KREDIT"
];
export const degree = [
  "S1",
  "S2",
  "S3"
];
export const gender = [
  "PRIA", 
  "WANITA"
];
export const religion = [
  "ISLAM", 
  "KATOLIK", 
  "PROTESTAN", 
  "BUDDHA", 
  "HINDU", 
  "KONGHUCU", 
  "DLL"
];
export const status = [
  "NONAKTIF", 
  "AKTIF", 
  "CUTI", 
  "DO", 
  "MENGUNDURKAN_DIRI", 
  "LULUS"
];
export const courseType = [
  "WAJIB", 
  "PILIHAN",
  "PILIHAN_KONSENTRASI",
];
export const semester = [
  "GANJIL", 
  "GENAP"
];
export const dayName = [
  "SENIN", 
  "SELASA", 
  "RABU", 
  "KAMIS", 
  "JUMAT", 
  "SABTU", 
  "MINGGU"
];
export const learningMethod = [
  "CERAMAH", 
  "DISKUSI", 
  "TUGAS", 
  "LATIHAN"
];
export const presenceDuration = [
  {label: "AKTIF", value: "AKTIF"},
  {label: "NONAKTIF", value: "NONAKTIF"},
  // {label: "1 MENIT", value: "MIN1"},
  {label: "5 MENIT", value: "MIN5"},
  {label: "15 MENIT", value: "MIN15"},
  {label: "30 MENIT", value: "MIN30"},
  {label: "45 MENIT", value: "MIN45"},
  {label: "1 JAM", value: "MIN60"},
  {label: "1,5 JAM", value: "MIN90"},
  {label: "2 JAM", value: "HOUR2"},
  {label: "12 JAM", value: "HOUR12"},
];
export const position = [
  "Wakabid Akademik", 
  "Kaprodi TI", 
  "Kaprodi SI"
];

export const ACCEPTED_IMAGE_TYPES = "image/jpeg, image/jpg, image/png";


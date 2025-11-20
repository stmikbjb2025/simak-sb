
export interface RoleTypes {
  id: number,
  name: string,
  description?: string,
  roleType: RoleType,
}

export interface PermissionTypes {
  id: number,
  name : string,
  description?: string,
}

export interface RolePermissionTypes {
  role: RoleTypes,
  permission: PermissionTypes,
}

export interface UserTypes {
  id: string,
  email: string,
  isStatus: boolean,
  role: RoleTypes,
}

export interface MajorTypes {
  id: number,
  name: string,
  numberCode?: number,
  stringCode: string,
}

export interface GradeComponentTypes {
  id: string,
  name: string,
  acronym: string
}

export interface AssessmentTypes {
  id: string,
  name: string,
}

export interface AssessmentDetailTypes {
  id: string,
  seq_number: number,
  assessmentId?: string,
  assessment: AssessmentTypes
  gradeId?: string,
  grade: GradeComponentTypes,
  percentage: number,

}

export interface CourseBaseTypes {
  id: string,
  name: string,
  code: string,
  sks: number,
  major: MajorTypes,
  isPKL: boolean,
  isSkripsi: boolean,
  courseType: string,
  assessment: AssessmentTypes,
}

export interface CourseTypes {
  id: string,
  name: string
  code: string,
  sks: number,
  isPKL: boolean,
  isSkripsi: boolean,
  major: MajorTypes,
  courseType: string,
  assessment: AssessmentTypes,

  predecessorId?: string
  predecessor?: CourseBaseTypes
  successor?: CourseBaseTypes
}

export interface CurriculumTypes {
  id: string,
  name: string,
  majorId?: number,
  major: MajorTypes,
  startDate: Date,
  endDate: Date,
  isActive: boolean,
}

export interface CurriculumDetailTypes {
  id: string,
  curriculum: CurriculumTypes,
  course: CourseTypes
  semester: number,
}

export interface LecturerTypes {
  id: string,
  npk?: string,
  nidn?: string,
  nuptk?: string,
  name: string
  frontTitle?: string,
  backTitle?: string,
  photo?: string,
  major: MajorTypes,
  user?: UserTypes
  role?: RoleTypes
}

export interface OperatorTypes {
  id: string,
  name: string,
  department?: string,
  user?: UserTypes,
  role?: RoleTypes
}

export interface StudentTypes {
  id: string,
  nim: string,
  name: string,
  year: string,
  photo?: string
  major: MajorTypes,
  lecturer: LecturerTypes,
  statusRegister: StatusRegister,
  studentStatus: StudentStatus,
  user?: UserTypes,
  role?: RoleTypes
}

export interface PositionTypes {
  id: string,
  positionName: string,
  personName: string,
}

export interface RoomTypes {
  id: number,
  name: string,
  location: Location,
  capacity: number,
}

export interface PeriodTypes {
  id: string
  year: number,
  semesterType: SemesterType
  name: string,
  isActive: boolean,
}

export interface ReregisterTypes {
  id: string,
  name: string,
  period: PeriodTypes,
  isReregisterActive: boolean,
}

export interface ReregisterDetailTypes {
  reregister: ReregisterTypes
  student: StudentTypes
  semester: number,
  semesterStatus: SemesterStatus,
  campusType?: CampusType
  lecturer: LecturerTypes
  nominal: number,
  paymentReceiptFile?: string,
  paymentStatus: PaymentStatus,
  paymentDescription?: string,
  isStatusForm: boolean,
}

export interface KrsTypes {
  id: string,
  reregister: ReregisterTypes,
  student: StudentTypes,
  reregisterDetail: ReregisterDetailTypes,
  maxSks: number,
  ips: number,
  lecturer: LecturerTypes
  isStatusForm: StudyPlanStatus
}

export interface KrsOverrideTypes {
  id: string,
  krs: KrsTypes,
  ips_allowed: number,
  sks_allowed: number,
}

export interface KrsDetailTypes {
  id: string,
  krs: KrsTypes,
  courseId?: string,
  course: CourseTypes,
  isAcc: boolean,
}

export interface KrsRuleTypes {
  id: string,
  statusRegister: StatusRegister,
  semester: number
  maxSks: number,
  autoPackage: boolean,
  allowManualSelection: boolean,
  isActive: boolean,
}

export interface AcademicClassTypes {
  id: string,
  name: string,
  period: PeriodTypes
  lecturer: LecturerTypes
  course: CourseBaseTypes,
  room: RoomTypes
  semester: number
}

export interface AcademicClassDetailTypes {
  id: string,
  academicClass: AcademicClassTypes,
  student: StudentTypes,
}

export interface PresenceTypes {
  id: string,
  academicClass: AcademicClassTypes
  weekNumber: number
  date: Date,
  duration: string,
  learningMethod: string
  lesson: string
  lessonDetail: string
  isActive: boolean
  presenceDuration: string
  activatedAt: Date
}

export interface PresenceDetailTypes {
  id: string
  presence: PresenceTypes
  academicClassDetail: AcademicClassDetailTypes
  presenceStatus: PresenceStatus
}

export interface TimeTypes {
  id: string,
  timeStart: Date,
  timeFinish: Date
}

export interface ScheduleTypes {
  id: string
  period: PeriodTypes
  name: string
  isActive: boolean
}

export interface ScheduleDetailTypes {
  id: string
  schedule: ScheduleTypes
  academicClass: AcademicClassTypes
  dayName: Day
  time: TimeTypes
}

export interface KhsTypes {
  id: string,
  krs: KrsTypes,
  student: StudentTypes,
  period: PeriodTypes,
  semester: number
  ips: number
  maxSks: number
  date: Date
  isRPL: boolean
}

export interface KhsGradeTypes {
  id: string,
  khsDetail: KhsDetailTypes
  assessmentDetail: AssessmentDetailTypes
  percentage: number
  score: number
}

export interface KhsDetailBaseTypes {
  id: string,
  khs: KhsTypes,
  course: CourseTypes
  finalScore: number,
  weight: number,
  gradeLetter: string
  status: AnnouncementKhs,
  version?: number
  isLatest?: boolean
  khsGrade: KhsGradeTypes[]
}

export interface KhsDetailTypes {
  id: string,
  khs: KhsTypes,
  course: CourseTypes
  finalScore: number,
  weight: number,
  gradeLetter: string
  status: AnnouncementKhs,

  version?: number
  isLatest?: boolean
  validFrom?: Date
  validTo?: Date
  khsGrade: KhsGradeTypes[]
  predecessor?: KhsDetailBaseTypes
  successor?: KhsDetailBaseTypes
}



export enum AnnouncementKhs {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  ANNOUNCEMENT = "ANNOUNCEMENT",
}

export enum PresenceStatus {
  HADIR = "HADIR",
  IZIN = "IZIN",
  SAKIT = "SAKIT",
  ALPA = "ALPA",
}

export enum Day {
  SENIN = "SENIN",
  SELASA = "SELASA",
  RABU = "RABU",
  KAMIS = "KAMIS",
  JUMAT = "JUMAT",
  SABTU = "SABTU",
  MINGGU = "MINGGU",
}

export enum StudyPlanStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  NEED_REVISION = "NEED_REVISION",
}

export enum SemesterType {
  GANJIL = "GANJIL",
  GENAP = "GENAP",
  GANJIL_PENDEK = "GANJIL_PENDEK",
  GENAP_PENDEK = "GENAP_PENDEK",
}

export enum Gender {
  PRIA = "PRIA",
  WANITA = "WANITA",
}

export enum Religion {
  ISLAM = "ISLAM",
  KATOLIK = "KATOLIK",
  PROTESTAN = "PROTESTAN",
  BUDDHA = "BUDDHA",
  HINDU = "HINDU",
  KONGHUCU = "KONGHUCU",
  DLL = "DLL",
}

export enum StudentStatus {
  AKTIF = "AKTIF",
  NONAKTIF = "NONAKTIF",
  CUTI = "CUTI",
  DO = "DO",
  MENGUNDURKAN_DIRI = "MENGUNDURKAN_DIRI",
  LULUS = "LULUS",
}

export enum StatusRegister {
  BARU = "BARU",
  TRANSFER_KREDIT = "TRANSFER_KREDIT",
  RENIM = "RENIM",
  PEROLEHAN_KREDIT = "PEROLEHAN_KREDIT",
}

export enum SemesterStatus {
  AKTIF = "AKTIF",
  NONAKTIF = "NONAKTIF",
  CUTI = "CUTI",
  DO = "DO",
  MENGUNDURKAN_DIRI = "MENGUNDURKAN_DIRI",
  LULUS = "LULUS",
}

export enum CampusType {
  BJB = "BJB",
  BJM = "BJM",
  SORE = "SORE",
  ONLINE = "ONLINE",
}

export enum Location {
  BJB = "BJB",
  BJM = "BJM",
}

export enum PaymentStatus {
  LUNAS = "LUNAS",
  BELUM_LUNAS = "BELUM_LUNAS",
}

export enum DegreeStatus {
  S1 = "S1",
  S2 = "S2",
  S3 = "S3",
}

export enum RoleType {
  STUDENT = "STUDENT",
  LECTURER = "LECTURER",
  ADVISOR = "ADVISOR",
  OPERATOR = "OPERATOR",
}
-- CreateEnum
CREATE TYPE "AnnouncementKhs" AS ENUM ('DRAFT', 'SUBMITTED', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "PresenceStatus" AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'ALPA');

-- CreateEnum
CREATE TYPE "Day" AS ENUM ('SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU');

-- CreateEnum
CREATE TYPE "StudyPlanStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'NEED_REVISION');

-- CreateEnum
CREATE TYPE "SemesterType" AS ENUM ('GANJIL', 'GENAP', 'GANJIL_PENDEK', 'GENAP_PENDEK');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('PRIA', 'WANITA');

-- CreateEnum
CREATE TYPE "Religion" AS ENUM ('ISLAM', 'KATOLIK', 'PROTESTAN', 'BUDDHA', 'HINDU', 'KONGHUCU', 'DLL');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('AKTIF', 'NONAKTIF', 'CUTI', 'DO', 'MENGUNDURKAN_DIRI', 'LULUS');

-- CreateEnum
CREATE TYPE "StatusRegister" AS ENUM ('BARU', 'TRANSFER_KREDIT', 'RENIM', 'PEROLEHAN_KREDIT');

-- CreateEnum
CREATE TYPE "SemesterStatus" AS ENUM ('AKTIF', 'NONAKTIF', 'CUTI', 'DO', 'MENGUNDURKAN_DIRI', 'LULUS');

-- CreateEnum
CREATE TYPE "CampusType" AS ENUM ('BJB', 'BJM', 'SORE', 'ONLINE');

-- CreateEnum
CREATE TYPE "Location" AS ENUM ('BJB', 'BJM');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('LUNAS', 'BELUM_LUNAS');

-- CreateEnum
CREATE TYPE "DegreeStatus" AS ENUM ('S1', 'S2', 'S3');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('STUDENT', 'LECTURER', 'ADVISOR', 'OPERATOR');

-- CreateTable
CREATE TABLE "sb25_roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "roleType" "RoleType" NOT NULL DEFAULT 'OPERATOR',

    CONSTRAINT "sb25_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,

    CONSTRAINT "sb25_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_role_permissions" (
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "sb25_role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "sb25_users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "isStatus" BOOLEAN DEFAULT false,
    "roleId" INTEGER,

    CONSTRAINT "sb25_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sb25_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_majors" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "numberCode" INTEGER,
    "stringCode" TEXT,

    CONSTRAINT "sb25_majors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_courses" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "code" TEXT,
    "sks" INTEGER,
    "majorId" INTEGER,
    "isPKL" BOOLEAN NOT NULL DEFAULT false,
    "isSkripsi" BOOLEAN NOT NULL DEFAULT false,
    "courseType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assessmentId" TEXT,
    "predecessorId" TEXT,

    CONSTRAINT "sb25_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_assessments" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "sb25_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_grade_components" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "acronym" TEXT,

    CONSTRAINT "sb25_grade_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_assessments_details" (
    "id" TEXT NOT NULL,
    "seq_number" SERIAL NOT NULL,
    "assessmentId" TEXT,
    "gradeId" TEXT,
    "percentage" INTEGER,

    CONSTRAINT "sb25_assessments_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_curriculums" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "majorId" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN DEFAULT false,

    CONSTRAINT "sb25_curriculums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_curriculum_details" (
    "id" TEXT NOT NULL,
    "curriculumId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "semester" INTEGER,

    CONSTRAINT "sb25_curriculum_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_lecturers" (
    "id" TEXT NOT NULL,
    "npk" TEXT,
    "nidn" TEXT,
    "nuptk" TEXT,
    "name" TEXT,
    "frontTitle" TEXT,
    "backTitle" TEXT,
    "degree" "DegreeStatus",
    "year" INTEGER,
    "religion" "Religion",
    "gender" "Gender",
    "address" TEXT,
    "email" TEXT,
    "hp" TEXT,
    "photo" TEXT,
    "majorId" INTEGER,
    "userId" TEXT,

    CONSTRAINT "sb25_lecturers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_operators" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "department" TEXT,
    "userId" TEXT,

    CONSTRAINT "sb25_operators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_students" (
    "id" TEXT NOT NULL,
    "nim" TEXT,
    "name" TEXT,
    "year" INTEGER,
    "religion" "Religion",
    "gender" "Gender",
    "address" TEXT,
    "placeOfBirth" TEXT,
    "birthday" TIMESTAMP(3),
    "domicile" TEXT,
    "email" TEXT,
    "hp" TEXT,
    "photo" TEXT,
    "statusRegister" "StatusRegister" NOT NULL DEFAULT 'BARU',
    "motherName" TEXT,
    "motherNIK" TEXT,
    "guardianName" TEXT,
    "guardianNIK" TEXT,
    "guardianHp" TEXT,
    "guardianJob" TEXT,
    "guardianAddress" TEXT,
    "studentStatus" "StudentStatus" NOT NULL DEFAULT 'NONAKTIF',
    "majorId" INTEGER,
    "lecturerId" TEXT,
    "userId" TEXT,

    CONSTRAINT "sb25_students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_position" (
    "id" TEXT NOT NULL,
    "positionName" TEXT,
    "personName" TEXT,

    CONSTRAINT "sb25_position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_rooms" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "location" "Location",
    "capacity" INTEGER,

    CONSTRAINT "sb25_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_periods" (
    "id" TEXT NOT NULL,
    "year" INTEGER,
    "semesterType" "SemesterType",
    "name" TEXT,
    "isActive" BOOLEAN DEFAULT false,

    CONSTRAINT "sb25_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_reregisters" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "periodId" TEXT,
    "isReregisterActive" BOOLEAN DEFAULT false,

    CONSTRAINT "sb25_reregisters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_reregister_details" (
    "reregisterId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "nominal" INTEGER,
    "paymentReceiptFile" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'BELUM_LUNAS',
    "semester" INTEGER,
    "semesterStatus" "SemesterStatus" NOT NULL DEFAULT 'NONAKTIF',
    "campusType" "CampusType",
    "lecturerId" TEXT,
    "paymentDescription" TEXT,
    "isStatusForm" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sb25_reregister_details_pkey" PRIMARY KEY ("reregisterId","studentId")
);

-- CreateTable
CREATE TABLE "sb25_krs" (
    "id" TEXT NOT NULL,
    "reregisterId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "maxSks" INTEGER,
    "ips" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "lecturerId" TEXT,
    "isStatusForm" "StudyPlanStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "sb25_krs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_krs_override" (
    "id" TEXT NOT NULL,
    "krsId" TEXT NOT NULL,
    "ips_allowed" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "sks_allowed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sb25_krs_override_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_krs_details" (
    "id" TEXT NOT NULL,
    "krsId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "isAcc" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sb25_krs_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_krs_rules" (
    "id" TEXT NOT NULL,
    "statusRegister" "StatusRegister" NOT NULL DEFAULT 'BARU',
    "semester" INTEGER NOT NULL DEFAULT 1,
    "maxSks" INTEGER NOT NULL DEFAULT 0,
    "autoPackage" BOOLEAN NOT NULL DEFAULT false,
    "allowManualSelection" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sb25_krs_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_academic_classes" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "periodId" TEXT,
    "lecturerId" TEXT,
    "courseId" TEXT,
    "roomId" INTEGER,
    "semester" INTEGER,

    CONSTRAINT "sb25_academic_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_academic_class_detail" (
    "id" TEXT NOT NULL,
    "academicClassId" TEXT,
    "studentId" TEXT,

    CONSTRAINT "sb25_academic_class_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_presences" (
    "id" TEXT NOT NULL,
    "academicClassId" TEXT,
    "weekNumber" INTEGER,
    "date" TIMESTAMP(3),
    "duration" TEXT,
    "learningMethod" TEXT,
    "lesson" TEXT,
    "lessonDetail" TEXT,
    "isActive" BOOLEAN DEFAULT false,
    "presenceDuration" TEXT,
    "activatedAt" TIMESTAMP(3),

    CONSTRAINT "sb25_presences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_presence_details" (
    "id" TEXT NOT NULL,
    "presenceId" TEXT,
    "academicClassDetailId" TEXT,
    "presenceStatus" "PresenceStatus" NOT NULL DEFAULT 'ALPA',

    CONSTRAINT "sb25_presence_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_times" (
    "id" TEXT NOT NULL,
    "timeStart" TIME,
    "timeFinish" TIME,

    CONSTRAINT "sb25_times_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_schedules" (
    "id" TEXT NOT NULL,
    "periodId" TEXT,
    "name" TEXT,
    "isActive" BOOLEAN DEFAULT false,

    CONSTRAINT "sb25_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_schedule_details" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "academicClassId" TEXT,
    "dayName" "Day" NOT NULL DEFAULT 'MINGGU',
    "timeId" TEXT,

    CONSTRAINT "sb25_schedule_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_khs" (
    "id" TEXT NOT NULL,
    "krsId" TEXT,
    "studentId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "semester" INTEGER DEFAULT 1,
    "ips" DECIMAL(3,2) DEFAULT 0,
    "maxSks" INTEGER,
    "date" TIMESTAMP(3),
    "isRPL" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sb25_khs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_khs_details" (
    "id" TEXT NOT NULL,
    "khsId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "finalScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "weight" DECIMAL(2,1) NOT NULL DEFAULT 0,
    "gradeLetter" TEXT NOT NULL DEFAULT 'E',
    "status" "AnnouncementKhs" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 0,
    "isLatest" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" TIMESTAMP(3),
    "predecessorId" TEXT,

    CONSTRAINT "sb25_khs_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sb25_khs_grades" (
    "id" TEXT NOT NULL,
    "khsDetailId" TEXT NOT NULL,
    "assessmentDetailId" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "sb25_khs_grades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sb25_roles_name_key" ON "sb25_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_permissions_name_key" ON "sb25_permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_users_email_key" ON "sb25_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_sessions_userId_key" ON "sb25_sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_majors_numberCode_key" ON "sb25_majors"("numberCode");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_majors_stringCode_key" ON "sb25_majors"("stringCode");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_courses_code_key" ON "sb25_courses"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_courses_predecessorId_key" ON "sb25_courses"("predecessorId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_assessments_name_key" ON "sb25_assessments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_grade_components_name_key" ON "sb25_grade_components"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_grade_components_acronym_key" ON "sb25_grade_components"("acronym");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_curriculums_name_key" ON "sb25_curriculums"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_lecturers_userId_key" ON "sb25_lecturers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_operators_userId_key" ON "sb25_operators"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_students_nim_key" ON "sb25_students"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_students_userId_key" ON "sb25_students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_position_positionName_key" ON "sb25_position"("positionName");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_periods_name_key" ON "sb25_periods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_krs_reregisterId_studentId_key" ON "sb25_krs"("reregisterId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_krs_override_krsId_key" ON "sb25_krs_override"("krsId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_krs_details_krsId_courseId_key" ON "sb25_krs_details"("krsId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_academic_classes_periodId_name_lecturerId_courseId_roo_key" ON "sb25_academic_classes"("periodId", "name", "lecturerId", "courseId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_times_timeStart_timeFinish_key" ON "sb25_times"("timeStart", "timeFinish");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_schedule_details_academicClassId_timeId_key" ON "sb25_schedule_details"("academicClassId", "timeId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_khs_krsId_key" ON "sb25_khs"("krsId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_khs_details_predecessorId_key" ON "sb25_khs_details"("predecessorId");

-- CreateIndex
CREATE UNIQUE INDEX "sb25_khs_details_khsId_courseId_version_key" ON "sb25_khs_details"("khsId", "courseId", "version");

-- AddForeignKey
ALTER TABLE "sb25_role_permissions" ADD CONSTRAINT "sb25_role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "sb25_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_role_permissions" ADD CONSTRAINT "sb25_role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "sb25_permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_users" ADD CONSTRAINT "sb25_users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "sb25_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_sessions" ADD CONSTRAINT "sb25_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sb25_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_courses" ADD CONSTRAINT "sb25_courses_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "sb25_majors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_courses" ADD CONSTRAINT "sb25_courses_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "sb25_assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_courses" ADD CONSTRAINT "sb25_courses_predecessorId_fkey" FOREIGN KEY ("predecessorId") REFERENCES "sb25_courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_assessments_details" ADD CONSTRAINT "sb25_assessments_details_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "sb25_assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_assessments_details" ADD CONSTRAINT "sb25_assessments_details_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "sb25_grade_components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_curriculums" ADD CONSTRAINT "sb25_curriculums_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "sb25_majors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_curriculum_details" ADD CONSTRAINT "sb25_curriculum_details_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "sb25_curriculums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_curriculum_details" ADD CONSTRAINT "sb25_curriculum_details_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "sb25_courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_lecturers" ADD CONSTRAINT "sb25_lecturers_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "sb25_majors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_lecturers" ADD CONSTRAINT "sb25_lecturers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sb25_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_operators" ADD CONSTRAINT "sb25_operators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sb25_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_students" ADD CONSTRAINT "sb25_students_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "sb25_majors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_students" ADD CONSTRAINT "sb25_students_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "sb25_lecturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_students" ADD CONSTRAINT "sb25_students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sb25_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_reregisters" ADD CONSTRAINT "sb25_reregisters_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "sb25_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_reregister_details" ADD CONSTRAINT "sb25_reregister_details_reregisterId_fkey" FOREIGN KEY ("reregisterId") REFERENCES "sb25_reregisters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_reregister_details" ADD CONSTRAINT "sb25_reregister_details_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "sb25_students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_reregister_details" ADD CONSTRAINT "sb25_reregister_details_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "sb25_lecturers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_krs" ADD CONSTRAINT "sb25_krs_reregisterId_fkey" FOREIGN KEY ("reregisterId") REFERENCES "sb25_reregisters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_krs" ADD CONSTRAINT "sb25_krs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "sb25_students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_krs" ADD CONSTRAINT "sb25_krs_reregisterId_studentId_fkey" FOREIGN KEY ("reregisterId", "studentId") REFERENCES "sb25_reregister_details"("reregisterId", "studentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_krs" ADD CONSTRAINT "sb25_krs_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "sb25_lecturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_krs_override" ADD CONSTRAINT "sb25_krs_override_krsId_fkey" FOREIGN KEY ("krsId") REFERENCES "sb25_krs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_krs_details" ADD CONSTRAINT "sb25_krs_details_krsId_fkey" FOREIGN KEY ("krsId") REFERENCES "sb25_krs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_krs_details" ADD CONSTRAINT "sb25_krs_details_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "sb25_courses"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "sb25_academic_classes" ADD CONSTRAINT "sb25_academic_classes_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "sb25_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_academic_classes" ADD CONSTRAINT "sb25_academic_classes_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "sb25_lecturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_academic_classes" ADD CONSTRAINT "sb25_academic_classes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "sb25_courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_academic_classes" ADD CONSTRAINT "sb25_academic_classes_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "sb25_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_academic_class_detail" ADD CONSTRAINT "sb25_academic_class_detail_academicClassId_fkey" FOREIGN KEY ("academicClassId") REFERENCES "sb25_academic_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_academic_class_detail" ADD CONSTRAINT "sb25_academic_class_detail_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "sb25_students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_presences" ADD CONSTRAINT "sb25_presences_academicClassId_fkey" FOREIGN KEY ("academicClassId") REFERENCES "sb25_academic_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_presence_details" ADD CONSTRAINT "sb25_presence_details_presenceId_fkey" FOREIGN KEY ("presenceId") REFERENCES "sb25_presences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_presence_details" ADD CONSTRAINT "sb25_presence_details_academicClassDetailId_fkey" FOREIGN KEY ("academicClassDetailId") REFERENCES "sb25_academic_class_detail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_schedules" ADD CONSTRAINT "sb25_schedules_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "sb25_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_schedule_details" ADD CONSTRAINT "sb25_schedule_details_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "sb25_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_schedule_details" ADD CONSTRAINT "sb25_schedule_details_academicClassId_fkey" FOREIGN KEY ("academicClassId") REFERENCES "sb25_academic_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_schedule_details" ADD CONSTRAINT "sb25_schedule_details_timeId_fkey" FOREIGN KEY ("timeId") REFERENCES "sb25_times"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_khs" ADD CONSTRAINT "sb25_khs_krsId_fkey" FOREIGN KEY ("krsId") REFERENCES "sb25_krs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_khs" ADD CONSTRAINT "sb25_khs_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "sb25_students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_khs" ADD CONSTRAINT "sb25_khs_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "sb25_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_khs_details" ADD CONSTRAINT "sb25_khs_details_khsId_fkey" FOREIGN KEY ("khsId") REFERENCES "sb25_khs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_khs_details" ADD CONSTRAINT "sb25_khs_details_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "sb25_courses"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "sb25_khs_details" ADD CONSTRAINT "sb25_khs_details_predecessorId_fkey" FOREIGN KEY ("predecessorId") REFERENCES "sb25_khs_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_khs_grades" ADD CONSTRAINT "sb25_khs_grades_khsDetailId_fkey" FOREIGN KEY ("khsDetailId") REFERENCES "sb25_khs_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sb25_khs_grades" ADD CONSTRAINT "sb25_khs_grades_assessmentDetailId_fkey" FOREIGN KEY ("assessmentDetailId") REFERENCES "sb25_assessments_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

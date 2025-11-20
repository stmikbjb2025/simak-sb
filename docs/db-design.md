# SimakApp

## GENERAL RULES

- Nama database simakdb
- Penamaan model pada prisma menggunakan pascal case
- Penamaaan tabel dengan @map prefix sb25_nama_tabel
- Penamaan field atau atribut menggunakan camel case
- Nama atribut di table menggunakan bahasa inggris
- Setiap tabel wajib mempunyai atribut PK dengan nama id
- Tabel yang tidak berhubungan dengan auth dan transaksi PK, menggunakan Int
  auto increment
- Tabel yang berhubungan dengan auth dan transaksi, PK menggunakan string uuid
- Tabel hubungan Many to Many menggunakan gabungan FK atau composite index
- Setiap atribut selain PK tambahkan ? supaya menjadi not require
- Value tipe data enum menggunakan huruf kapital

## ENUM CAMUS

```json
enum SemesterType {
  GANJIL
  GENAP
  GANJIL_PENDEK
  GENAP_PENDEK
}

enum Gender {
  PRIA
  WANITA
}

enum Religion {
  ISLAM
  KATOLIK
  PROTESTAN
  BUDDHA
  HINDU
  KONGHUCU
  DLL
}

enum StudentStatus {
  AKTIF
  NONAKTIF
  CUTI
  DO
  MENGUNDURKAN_DIRI
  LULUS
}

enum SemesterStatus {
  AKTIF
  NONAKTIF
  CUTI
  DO
  MENGUNDURKAN_DIRI
  LULUS
}

enum CampusType {
  BJB
  BJM
  SORE
  ONLINE
}

enum Location {
    BJB
    BJM
}

enum PaymentStatus {
  LUNAS
  BELUM_LUNAS
}

enum DegreeStatus {
  S1
  S2
  S3
}

enum RoleType {
  Student
  Lecturer
  Advisor
  Operator
}
```

## Table Specs

### Major

- id Int PK AUTO_INCREMENT
- numberCode Int?
- stringCode String?
- name String?

### Room

- id Int PK AUTO_INCREMENT
- name String?
- location Location?
- capacity Int?

### Role

- id Int PK AUTO_INCREMENT
- name String?
- description String?

### Permission

- id Int PK AUTO_INCREMENT
- name String?
- description String?

### RolePermission

- @@id (roleId, permissionId)
- roleId Int? FK
- permissionId Int? FK

### User

- id String PK uuid
- email String? UNIQUE
- password String?
- roleId Int?

### Operator

- id String PK uuid
- name
- position
- departement
- userId

### Lecturer

- id String PK uuid
- npk String?
- nidn String?
- nuptk String?
- name String?
- degree DegreeStatus?
- frontTitle String?
- backTitle String?
- year Int?
- religion Religion?
- gender Gender?
- address String?
- email String?
- hp String?
- photo String?
- majorId Int?
- userId String?

### Student

- id String PK uuid
- nim String?
- name String?
- year Int?
- religion Religion?
- gender Gender?
- address String?
- email String?
- hp String?
- photo String?
- fatherName String?
- motherName String?
- guardianName String?
- guardianHp String?
- nowReregisterId String?
- nowStatusReregister StudentStatus?
- prevReregisterId String?
- prevStatusReregister StudentStatus?
- statusNotes String?
- campusType CampusType?
- majorId Int?
- lecturerId Int?
- yearReregister Int?
- registerSemester String?
- semester Int?
- statusRegister String?
  - Transfer (minimal 3 semester)
  - Baru

### Course

- id String PK uuid
- code String?
- name String?
<!-- - specialCourse
  - PKL
  - TA
    - Skripsi
    - Prototype
    - Portofolio
    - Publikasi Jurnal -->
- sks Int?
- majorId Int?

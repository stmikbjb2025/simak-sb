# KRS Specifications

## Translate

- en: krs
- id: krs

## Examples of Data:

## Data Model

- id
  - String
  - PK
  - uuid
- reregisterId
  - String?
  - FK
  - uuid
  - required
- studentId
  - String?
  - FK
  - uuid
  - required
- isStatusForm
  - StudyPlanStatus?
  - default (DRAFT)
- maxSks
- lecturerId
  - String?
  - FK
  - uuid
  - required

```
enum StudyPlanStatus {
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'REJECTED',
  'NEED_REVISION'
}
```

## Bussiness Rules

- Admin dapat membuatkan KRS untuk mahasiswa secara umum yang mengisi KRS adalah mahasiswa.
- Tombol tambah untuk mahasiswa RPL (Belum dieksekusi)

<!-- UNTUK DIHAPUS -->

```
NOTE: UNTUK DIBAHAS DI KHS
- personName
  - String?
- positionName
  - String?

- Kalau di KRS, mengetahui dosen wali
- Kalau di KHS, mengetahui kaprodi
  - Kaprodi yang ditampilkan, apakah ketika KHS dibuat?
- Kalau di Transkip, mengetahui Wakil Ketua Bidang Akademik dan Kemahasiswaan.
  - Wakabid yang ditampilkan, apakah ketika Transkip dibuat?
  - Di transkip sementara, apakah diperlukan mengetahui jabatan akademik?
```

### Alur pembuatkan data KRS di sistem

- Ketika Admin mnegubah data reregisterDetail status AKTIF, data KRS juga langsung dibuat.
- Permaslahan : 1. Apakah mahasiswa yang mengajukan cuti juga harus memiliki data KRS di semester saat cuti ? --TIDAK-- 2. Apakah mahasiswa yang nonaktif, juga harus memiliki data KRS di semester saat nonaktif ? --TIDAK--

# Academic Class Specifications

## Translate

- en: academic class
- id: kelas

## Examples of Data:

## Data Model

- id
  - String
  - PK
  - uuid
- name
  - string?
  - required
  - contoh : "46", "31"
- periodId
  - String
  - FK
  - uuid
- lecturerId
  - String
  - FK
  - uuid
- courseId
  - String
  - FK
  - uuid
- roomId
  - Integer
  - FK
  <!-- pasti bentrok, jika sama dengan waktu, contoh di pada waktu 08.00-09.30 di ruang 202 ada dua kelas.  -->
- semester
  - int
  - terisi otomatis ketika memilih mata kuliah (diambil dari kurikulum)
  - 1 s/d 8

## Bussiness Rules

- Satu mata kuliah bisa diajarkan oleh 2 dosen dengan kelas yang berbeda
- Jika prodi = SI, semester = 1, dan mata kuliah = BELUM ADA, maka name class sama 11
- Jika prodi = SI, semester = 1, dan mata kuliah = SUDAH ADA, maka name class sama 12
- Jika prodi = TI, semester = 1, dan mata kuliah = BELUM ADA, maka name class sama 16
- Jika prodi = TI, semester = 1, dan mata kuliah = SUDAH ADA, maka name class sama 17
- majorId tidak dibuatkan fieldnya karena mengambil dari field courseId

<!-- CONTOH -->

<!-- - Dosen A mengajar matkulA di kelas 31 32
- Dosen A mengajar matkulB di kelas 46 47
  -- Artinya :
- DosenA bisa mengajar di hari yang sama.
- DosenA tidak bisa mengajar di waktu yang sama.
- DosenA hanya bisa megajar 1 matkul di 1 waktu.
- DosenA hanya bisa mengajar di 1 kelas di 1 waktu. -->

<!-- PROSES -->

- APAKAH KELAS DIBUAT BERDASAKAN PADA MK?
- sistem menampilkan data MK yang akan dijalankan.
- admin menginputkan data MK. data semester dan major otomatis terisi.
- di action server. name akan diisi sesuai ketentuan.
  ---PeriodID apakah diisi berdasarkan tanggal sekarang atau dipilih?
-

===UNIQUE(name, courseId, lecturerId, roomId)

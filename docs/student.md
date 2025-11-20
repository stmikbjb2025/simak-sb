# Employee Specifications

## Translate

- en: student
- id: mahasiswa

## Data Model and Form

- id
  - String
  - PK
  - default uuid
- nim
  - --nomor induk mahasiswa
  - String?
  - Required
- name
  - --nama mahasiswa
  - String?
  - required
- year
  - --tahun terdaftar menjadi mahasiswa
  - Int?
  - Required
- religion
  - --agama
  - Religion?
  - Optional
- gender
  - --jenis kelamin
  - Gender?
  - Required
- address
  - --alamat tempat tinggal
  - String?
  - Optional
- email
  - String?
  - Optional
- hp
  - String?
  - Optional
- photo
  - String?
  - Optional
- fatherName
  - String?
  - Optional
- motherName
  - String?
  - Optional
- guardianName
  - --Nama wali
  - String?
  - Optional
- guardianHp

  - String?
  - Optional

- majorId
  - Int?
  - FK dari Major
  - Required
- lecturerId
  - --dosen wali
  - Int?
  - FK dari Lecturer
- statusRegister
  - --status mahasiswa pada saat register
    - Baru
    - RPL (Rekognisi Pembelajaran Lampau)
      - Transfer kredit
      - Segala sesuatu yang memerlukan transfer nilai dari kuliah sebelumnya, maka melewati jalur transfer kredit
        -- Contoh :
        - Transfer kuliah => antar kampus/Perguruan Tinggi
        - Renim => kuliah di STMIK BJB, SI, 13smt (renim) pindah ke TI, supaya tidak kena DO, solusinya melakukan Renim dan pindah jurusan ke TI. Inti Renim itu antar jurusan tiap kampus. Transkip nilai sebelumnya tetap diakui, dan kembali memulai dari semester 1 dengan nim baru.
      - Perolehan kredit
        - Pernah bekerja di bidang yang sama dengan jurusan kuliah yang akan diregister, pihak akademik akan menganalis portofolio selama bekerja tersebut dengan menyesuikan mata kuliah yang sesuai.
          --Contoh:
        - punya portofolio jadi web programmer selama 3 tahun, pihak akademik melakukan test terhadap skil calon mahasiswa tersebut, maka calon mahasiswa tersebut sudah menyelesaikan mata kuliah yang berhubungan dengan pemograman web.

## Examples of Data:

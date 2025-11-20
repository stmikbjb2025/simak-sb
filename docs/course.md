# Major Specifications

## Translate

- en: course
- id: mata kuliah

## Examples of Data:

## Data Model

- id
  - String
  - PK
  - uuid
- prevId
  - String?
  - uuid
  - FK
  - relasi ke dirinya sendiri
  - optional
- code
  - --kode mata kuliah
  - String?
  - Required
- name
  - --nama mata kuliah
  - String?
  - Required
- sks
  - --jumlah sks mata kuliah
  - Int?
  - Required
- courseType
  - string?
  - enum [wajib, pilihan]
  - default(wajib)
  - required
- majorId
  - --Prodi mata kuliah
  - String?
  - FK dari Major
  - Required
- isPKL
  - boolean?
  - default false
- isSkripsi
  - boolean?
  - default false
- createdAt
  - Date?
  - default Date.now()
  - orderBy desc
- assessmentId
  - String
  - FK
  - required

## Bussiness Rules

- code harus unique
- nama mata kuliah boleh sama dalam satu prodi asalkan SKS berbeda

  <!-- - assesmentType:
  - REGULAR
  - Komponen nilai:
    - Presensi: 10%
    - Tugas Mandiri: 20%
    - Tugas Kelompok: 10%
    - UTS: 25%
    - UAS: 35%
  - CASE METHOD
  - Komponen nilai:
    - Presensi: 10%
    - Tugas Mandiri: 35%
    - Tugas Kelompok: 15%
    - UTS: 20%
    - UAS: 20% -->

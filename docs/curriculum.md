# Curriculum Specifications

## Translate

- en: Curriculum
- id: Kurikulum

## Data Model and Form

- id
  - String
  - PK
  - uuid
- name
  - String?
  - required
  - contoh: kurikulum merdeka SI 2025
- majodId
  - String
  - FK
  - uuid
- startDate
  - Date?
  - required
- endDate
  - Date?
  - required
- isActive
  - -- Mengatur status aktif curriculum
    - hanya boleh satu kurikulum aktif per prodi
  - Boolean?
  - default false
  - required

## Bussiness Rules

- mata kuliah yang sudah ditawarkan pada suatu semester, tidak boleh ada kembali di semester yang lain.
- Jika terjadi perubahan terhadap mata kuliah di semester, solusinya membuat kurikulum revisi/ kurikulum baru. dengan contoh penamaan : kurikulum awal "KURIKULUM MERDEKA SI 2025", lalu membuat kurikulum baru dengan nama "KURIKULUM MERDEKA SI 2025 REVISI 1".
- Ketika admin mencentang checkbox status kurikulum, akan tampil pesan "Kurikulum sebelumnya akan dinonaktifkan !".
- Data grid di Kurikulum diurutkan berdasarkan startDate desc

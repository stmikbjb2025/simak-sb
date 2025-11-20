# Lecturer Specifications

## Translate

- en: lecturer
- id: dosen

## Data Model and Form

- id String PK uuid
  - id unik primary key
- name
  - --nama dosen
  - String?
  - Required
- npk
  - --nomor pokok karyawan
  - String?
  - Required
- nidn
  - --nomor induk dosen nasional
  - String?
  - Required
- nuptk
  - --Nomor Urut Pendidik dan Tenaga Kependidikan
  - String?
  - optional
  - 16 digit (klo ngisi wajib 16 digit)
  - 6937768669130402 (contoh)
- degree
  - DegreeStatus?
  - Optional
- frontTitle
  - --gelar depan
  - String?
  - Optional
- backTitle
  - --gelar belakang
  - String?
  - Optional
- year
  - --tahun masuk menjadi dosen
  - Int?
- religion
  - --agama
  - Religion?
  - Optional
- gender
  - --Jenis kelamin
  - Gender?
  - Required
- address
  - --alamat
  - String?
  - Optional
- email
  - --email personal
  - String?
  - Optional
- hp
  - String?
  - Optional
- photo
  - String?
  - Optional
- majorId
  - Int?
  - Required
- userId
  - String?
  - Optional

## Examples of Data:

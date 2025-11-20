# Schedule Specifications

## Translate

- en: schedule
- id: jadwal

## Examples of Data:

## Data Model

- id
  - String?
  - PK
  - uuid
- name
  - String?
  - required
- periodId
  - String?
  - FK
  - uuid
- isActive
  - boolean
  - default(false)

## Bussiness Rules

<!-- - Jika Hari, ruangan, waktu sama, maka bentrok. -->

- Jika Hari, ruangan, waktu sama, prodi sama maka bentrok.
- Dosen tidak dapat mengajar di hari dan waktu yang sama, prodi sama.

- Dosen bisa mengajar 2 MK di satu waktu asal ruang sama.
- Dosen hanya bisa mengajar 1 kelas di satu waktu.

- isActive digunakan untuk menampilkan jadwal mana yang akan ditampilkan di dosen, dan mahasiswa.

# Presence Specifications

## Translate

- en: presence
- id: presensi

## Data Model and Form

# Presence

- id
  - String
  - uuid
  - PK
- academicClassId
  - String?
  - uuid
  - FK
- weekNumber
  - Int?
- date
  - Date?
- duration
  - String?
  - // Durasi dosen mengajar.
- learningMethod
  - String?
  - Jika lebih dari satu, pisahkan dengan koma.
- lesson
  - String?
  - ind: Pokok Bahasan
- lessonDetail
  - String?
  - ind: Sub-Pokok Bahasan
- isActive
  - Boolean
  - default(false)
- presenceDuration
  - // Berapa lama presensi diaktifkan.
  - DateTime
  - Di prisma hanya ada DateTime.

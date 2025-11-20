# Academic Class Detail Specifications

## Translate

- en: academic class detail
- id: kelas detail

## Examples of Data:

## Data Model

- id
  - String
  - PK
  - uuid
- classId
  - String
  - FK
  - uuid
- studentId
  - String
  - FK
  - uuid
- gradeNumber
  - Decimal
  - 2 digit dibelakang koma
  - required
- GradeLetter
  - String?
  - required

## Bussiness Rules

- Mahasiswa tidak bisa mendapatkan jadwal mata kuliah di hari dan waktu yang sama.
-

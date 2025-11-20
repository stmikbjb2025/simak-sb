# Assessment Detail Specifications

## Translate

- en: assessmentDetail
- id: detail penilaian

## Examples of Data:

## Data Model

- id
  - String
  - PK
  - uuid
- seq_number
  - Int
  - @default(autoincrement())
- assesmentId
  - String
  - FK
  - required
- gradeId
  - String
  - FK
  - required
- percentage
  - Int
  - required

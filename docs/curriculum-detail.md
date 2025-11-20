# Curriculum Detail Specifications

## Translate

- en: Curriculum Detail
- id: Kurikulum Detail

## Data Model and Form

- id
  - String
  - PK
  - uuid
- curriculumId
  - String?
  - FK
  - uuid
  - required
- courseId
  - String?
  - FK
  - uuid
  - required
- semester
  - Integer?
  - 1 s/d 8
  - required

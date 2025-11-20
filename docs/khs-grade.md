# KHS Grade Specifications

## Translate

- en: Khs Grade
- id: Ketentuan Nilai Khs

## Data Model and Form

- id
  - String
  - PK
  - uuid
- khsDetailId
  - String?
  - FK
  - uuid
  - required
- assessmentDetailId
  - String?
  - FK
  - uuid
  - required
- percentage
  - Int?
  - required
- score
  - Int?
  - required

## Bussiness Rules

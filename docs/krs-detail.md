# Krs Detail Specifications

## Translate

- en: Krs Detail
- id: Krs Detail

## Data Model and Form

- id
  - String
  - PK
  - uuid
- krsId
  - String?
  - FK
  - uuid
  - required
- courseId
  - String?
  - FK
  - uuid
  - required
- isAcc
  - Boolean?
  - default false
  - required

## Bussiness Rules

- mata kuliah yang ditawarkan di KRS berasal dari curriculum detail. Namun, ketika menambahkan data ke KrsDetail yang diambil hanya courseId saja.

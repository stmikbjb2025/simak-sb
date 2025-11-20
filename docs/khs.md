# KHS Specifications

## Translate

- en: khs
- id: khs

## Examples of Data:

## Data Model

- id
  - String
  - PK
  - uuid
- krsId
  - String?
  - FK
  - uuid
- studentId
  - String?
  - FK
  - uuid
  - required
- periodId
  - String?
  - FK
  - uuid
  - required
- semester
  - Int?
  - default(1)
  - required
- ips
  - Decimal?
  - default(0) 2 angka dibelakang koma
- maxSks
  - Int?
  - default(0)
- date
  - Datetime?
- isRPL
  - Boolean
  - default(false)
  - menjadi true, jika data yang diinput merupakan data RPL.


## Bussiness Rules


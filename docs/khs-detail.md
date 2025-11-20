# KHS Detail Specifications

## Translate

- en: khs detail
- id: khs detail

## Examples of Data:

## Data Model

- id
  - String
  - PK
  - uuid
- khsId
  - String
  - FK
  - uuid
  - required
- courseId
  - String
  - FK
  - uuid
  - required
- finalScore
  - Decimal?
  - default(0)
  - 2 digit dibelakang koma
- weight
  - Decimal?
  - default(0)
  - 1 digit dibelakang koma
- gradeLetter
  - String?
  - default("E")
- version
  - Int
  - default(1)
  - required
- isLatest
  - Boolean
  - default(true)
  - required
- validFrom
  - DateTime
  - default(now())
  - required
- validTo
  - DateTime?
- predecessorId
  - String?
  - mengambil Id Khs-Detail sebelumnya.

## Bussiness Rules

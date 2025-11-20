# Student KRS Rule Specifications

## Translate

- en: Student KRS Rule
- id: aturan KRS mahasiswa

## Examples of Data:

## Data Model

- id
  - String
  - PK
  - uuid
- statusRegister
  - String?
  - required
- semester
  - Int?
  - required
- maxSks
  - int?
  - default(0)
  <!-- digunakan untuk mahasiswa dengan statusRegister "baru". tidak menggunakan jumlah sks ditable ini, tapi langsung mengambil MK di kurikulum semester tersebut -->
  - required
- autoPackage
  - boolean?
  - default (false)
- allowManualSelection
  - boolean?
  - default (false)
- isActive
  - boolean?
  - default (false)

```
enum statusRegister {
  "BARU",
  "TRANSFER KREDIT",
  "RENIM",
  "PEROLEHAN KREDIT",
}
```

## Bussiness Rules

### Alur pembuatkan data KRS di sistem

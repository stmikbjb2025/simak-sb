# Presence Detail Specifications

## Translate

- en: presence detail
- id: detail presensi

## Data Model and Form

# Presence Detail

- id
  - String?
  - uuid
  - PK
- presenceId
  - String?
  - uuid
  - FK
- academicClassDetailId
  - String?
  - uuid
  - FK
- presenceStatus
  - Enum PresenceStatus
  - default(ALPA),
<!-- - meeting2
  - Enum PresenceStatus
  - default(ALPA),
- meeting3
  - Enum PresenceStatus
  - default(ALPA),
- meeting4
  - Enum PresenceStatus
  - default(ALPA),
- meeting5
  - Enum PresenceStatus
  - default(ALPA),
- meeting6
  - Enum PresenceStatus
  - default(ALPA),
- meeting7
  - Enum PresenceStatus
  - default(ALPA),
- meeting8
  - Enum PresenceStatus
  - default(ALPA),
- meeting9
  - Enum PresenceStatus
  - default(ALPA),
- meeting10
  - Enum PresenceStatus
  - default(ALPA),
- meeting11
  - Enum PresenceStatus
  - default(ALPA),
- meeting12
  - Enum PresenceStatus
  - default(ALPA),
- meeting13
  - Enum PresenceStatus
  - default(ALPA),
- meeting14
  - Enum PresenceStatus
  - default(ALPA),
- meeting15
  - Enum PresenceStatus
  - default(ALPA),
- meeting16
  - Enum PresenceStatus
  - default(ALPA), -->

```json
enum PresenceStatus {
  HADIR
  IZIN
  SAKIT
  ALPA
}
```

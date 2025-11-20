# Reregister Specifications

## Translate

- en: reregister
- id: daftar ulang

## Data Model and Form

# Reregister

- id
  - string?
  - uuid
  - PK
- periodId
  - FK
  - string?
  - uuid
  - required
- name
  - String?
  - required
- isReregisterActive
  - boolean default(false)
  - required

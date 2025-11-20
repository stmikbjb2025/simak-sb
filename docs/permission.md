# Permission Specifications

## Translate

- en: permission
- id: fitur yang diizinkan untuk diakses

## Examples of Data:

## Data Model

- id
  - Int
  - PK
  - auto_increment
  - Required
- name
  - --nama permission
  - String?
  - Required
- description
  - --deskripsi dari fitur yang diizinkan
  - String?
  - Optional

### Data Examples

| id  |    name     | description          |
| :-- | :---------: | :------------------- |
| 1   | Create User | Menambah user        |
| 2   |  Read User  | Melihat data user    |
| 3   | Update User | Mengupdate data user |

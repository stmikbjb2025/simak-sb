# Permission Specifications

## Translate

- en: User
- id: Pengguna

## Examples of Data:

## Data Model

- id
  - String
  - uuid
  - required
- roleId
  - Int?
  - FK dari id table Role
  - required
- email
  - --email intitusi untuk login
  - String?
  - required
  - unique
- password
  - --password user untuk login
  - String?
  - required
- isStatus
  - --status login
  - boolean?
  - default(false)

### Data Examples

| id  | roleId (FK)  | email           | password |
| :-- | :----------: | :-------------- | :------- |
| 1   |  1 (admin)   | user1@gmail.com | 345abqa  |
| 2   | 2 (operator) | user2@gmail.com | 65432q1  |

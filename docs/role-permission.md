# Permission Specifications

## Translate

- en: RolePermission
- id: PeranFiturDiizinkan

## Examples of Data:

## Data Model

- @@id([roleId, permissionId]) // Composite Primary Key
- roleId Int? FK
  - FK dari id table Role
  - required
- permissionId Int? FK
  - FK dari id table Permission
  - required

### Data Examples

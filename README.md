## VSCode plugins required
  - Editor config
  - ESLint
  - Prettier
  - Material Icon Theme

## Enable uuid_generate_v4 function on PostgreSQL

```sql
  create extension IF NOT EXISTS "uuid-ossp" schema pg_catalog version "1.1";
```

## Folder icons - Paste the code below in your settings JSON on vscode

````json
"material-icon-theme.folders.associations": {
  "infra": "app",
  "entities": "class",
  "schemas": "class",
  "typeorm": "database",
  "repositories": "mappings",
  "http": "container",
  "migrations": "tools",
  "modules": "components",
  "implementations": "core",
  "dtos": "typescript",
  "fake": "mock",
},

"material-icon-theme.files.associations": {
  "ormconfig.json": "database",
  "tsconfig.json": "tune"
}
```

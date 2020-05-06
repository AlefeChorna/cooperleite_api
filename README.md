## VSCode plugins required
  - Editor config
  - ESLint
  - Prettier

## Enable uuid_generate_v4 function on PostgreSQL

```sql
  create extension IF NOT EXISTS "uuid-ossp" schema pg_catalog version "1.1";
```

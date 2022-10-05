# elemental-orm

**Package in early development, API may change**

Modular TypeScript hybrid ORM with PostgreSQL and Redis support, built on top of `pg-promise`, `redis-om`, together with GraphQL utilities. Provides functional helper utils together with model classes that can be used to generate raw SQL or execute PostgreSQL queries.

Intended to be used by ORM skeptics who like the best of both worlds: flexibility to write custom raw SQL and save time and minimise code needed, with pre-generated SQL with a model-based API.

API inspired by Django ORM.

## Plans

- SQL/Redis adapter classes to support different PostgreSQL and Redis clients or different database engines.
- Generate raw `*.sql` files and schema, with a GraphQL schema from model files.




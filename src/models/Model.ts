import { IDatabase, IMain } from 'pg-promise';
import { IResult } from 'pg-promise/typescript/pg-subset';
// import log from 'loglevel';
const log = {
  debug: (_: any) => {},
  log: (_: any) => {},
};

import { camelToSnakeCase, snakeToCamelCase } from '../utils/case';


const flattenSqlValues = (values: any) =>
  (Array.isArray(values) ? values : [values]).reduce((acc, val, i) => {
    const resObj: any = {};
    Object.keys(val).forEach((id) => {
      const [table, column] = id.split('.');

      if (!resObj[table]) {
        resObj[table] = {};
      }
      resObj[table][column] = val[id];

    });
    acc.push(resObj);

    return acc;
  }, []);

const whereSqlFields = (pg: IMain) => (args: any, tableName: string) => {
  const whereKeys: string[] = [];
  Object.keys(args).forEach((k) => {
    const v = args[k];

    const query = pg.as.format('$1:name.$2:name = $3', [
      tableName, camelToSnakeCase(k), v,
    ]);

    whereKeys.push(query);
  });

  return `${whereKeys.join(' AND ')}`;
};


export type ObjectsType = {
  all: () => void,
  create: () => void,
};

const aliasSqlFields = (fields: any, tableName: string) => Object.keys(fields).map((id, i) =>
  `${tableName}.${camelToSnakeCase(id)} AS "${tableName}.${id}"`);

class Model {
  // [key: string]: Field;
  [index: string]: any

  save: () => void = () => {};

  // pg: 
  // db: IDatabase<any>;
  // pg: IMain;
  constructor(private db: IDatabase<any>, private pg: IMain) {
    this.db = db;
    this.pg = pg;
  }

  __meta: {
    name?: string,
    cs?: any,
    db_table?: string,
  } = {};

  getMeta() {
    if (!this.__meta && this.Meta) {
      this.__meta = this.Meta;
    }

    return this.__meta || this.Meta || {};
  }

  getTableName() {
    const { db_table: name } = this.getMeta(); 

    return name || this.constructor.name.toLowerCase();
  }

  getFields() {
    const { objects, save, getTableName, __meta, Meta, ...fields } = this;

    return fields;
  }

  getPrimaryKeyFields() {
    const fields = this.getFields();
    const tableName = this.getTableName();

    return Object.keys(fields).filter((field) => {
      const val = fields[field];
      return val.metadata.type.includes('REFERENCES');
    });
  }

  getJoinFields() {
    const fields = this.getFields();
    const joinFields: string[] = [];
    const primaryKeyFields = this.getPrimaryKeyFields();

    primaryKeyFields.forEach((k: any) => {
      const field = fields[k];
      const instanceFields = field.metadata.toInstance.getFields();

      Object.keys(instanceFields)
        .forEach((n) => joinFields.push(
          `${field.metadata.to}.${camelToSnakeCase(n)} AS "${field.metadata.to}.${snakeToCamelCase(n)}"`
          ))
    });

    return joinFields;
  }

  getInnerJoin() {
    const fields = this.getFields();
    const tableName = this.getTableName();

    const primaryKeyFields = this.getPrimaryKeyFields();

    const sql = primaryKeyFields.map((field) => {
      const { metadata } = fields[field];
      return `LEFT JOIN ${metadata.to} ON ${tableName}.${camelToSnakeCase(field)} = ${metadata.to}.id`;
    }).join('\n');


    return sql;
  }

  getCs() {
    const { pg } = this;
    const fields = this.getFields();
    const tableName = this.getTableName();

    if (!this.__meta?.cs) {
      this.__meta.cs = new pg.helpers.ColumnSet(
        ['?id', ...Object.keys(fields).filter(n => n !== 'id').map(n => camelToSnakeCase(n))],
        { table: tableName },
      );
    }

    return this.__meta.cs;
  }

  objects = {
    all: async () => {
      const { db } = this;
      const fields = this.getFields();
      const tableName = this.getTableName();

      const dbFields = aliasSqlFields(fields, tableName);
      const joinFields = this.getJoinFields();
      const query = `SELECT ${[...dbFields, ...joinFields].join(', ')} FROM ${tableName} ${this.getInnerJoin()}`;

      const values = await db.any(query);

      const res = flattenSqlValues(values);

      // log.debug({ query, res: res[0] });

      return res;
    },
    get: async (args: any) => {
      const { db, pg } = this;
      const fields = this.getFields();
      const tableName = this.getTableName();

      const dbFields = aliasSqlFields(fields, tableName);
      const whereArgs = whereSqlFields(pg)(args, tableName);
      const joinFields = this.getJoinFields();

      const query = `SELECT ${[...dbFields, ...joinFields].join(', ')} FROM ${tableName} ${this.getInnerJoin()} WHERE ${whereArgs}`;

      log.debug({ query, whereArgs });
      const rawRes = await db.any(query);
      const [res] = flattenSqlValues(rawRes);

      return res;
    },
    delete: async (args: any) => {
      const { db, pg } = this;
      // const fields = this.getFields();
      const tableName = this.getTableName();

      // const dbFields = aliasSqlFields(fields, tableName);
      const whereArgs = whereSqlFields(pg)(args, tableName);
      // const joinFields = this.getJoinFields();

      const query = `DELETE FROM ${tableName} WHERE ${whereArgs}`;

      log.debug({ query, whereArgs });
      return await db.result(query, (a: any) => a.rowCount);
    },
    create: async (_args: any) => {
      const { db, pg } = this;
      const fields = this.getFields();
      const tableName = this.getTableName();

      const dbFields = aliasSqlFields(fields, tableName);
      const args = Object.keys(_args)
      .filter((n) => n !== 'id' && Object.keys(fields).includes(n))
      .reduce((acc: any, k) => { acc[camelToSnakeCase(k)] = _args[k]; return acc;}, {});

      const cs = new pg.helpers.ColumnSet(
        Object.keys(args).map(arg => ({ name: arg, mod: fields[snakeToCamelCase(arg)].metadata.mod })),
        { table: tableName }
      );


      const query = `${pg.helpers.insert(args, cs)} RETURNING ${dbFields.join(', ')}`;

      log.debug({ query });

      return flattenSqlValues(await db.any(query))[0];
    },
    bulkCreate: async (_values: any) => {
      const { pg, db } = this;

      const tableName = this.getTableName();
      const fields = this.getFields();

      const csArgs: any = {};
      
      const values = _values.map((_args: any) => {
        const args = Object.keys(_args)
          .filter((n) => n !== 'id' && Object.keys(fields).includes(n))
          .reduce((acc: any, k) => { acc[camelToSnakeCase(k)] = _args[k]; return acc;}, {});

        Object.keys(_args).forEach((k) => {
          csArgs[camelToSnakeCase(k)] = 0;
        });

        return args;
      });
      

        // .filter((n) => n !== 'id' && Object.keys(fields).includes(n));
      log.debug({ values, csArgs });
      const cs = new pg.helpers.ColumnSet(
        Object.keys(csArgs).map(arg => ({ name: arg, mod: fields[snakeToCamelCase(arg)].metadata.mod })),
        { table: tableName }
      );
      log.debug({ values, csArgs, cs })


      const query = pg.helpers.insert(values, cs);

      log.debug({ query });

      await db.none(query);
    },
    update: async (_args: any, whereFilter: any) => {
      const { db, pg } = this;
      // const cs = this.getCs();
      const fields = this.getFields();
      const tableName = this.getTableName();
      // const where = pg.as.format('WHERE id = $1', [id]);
      const whereArgs = whereSqlFields(pg)(whereFilter, tableName);

      const dbFields = aliasSqlFields(fields, tableName);
      const args = Object.keys(_args)
        .filter((n) => n !== 'id' && Object.keys(fields).includes(n))
        .reduce((acc: any, k) => { acc[camelToSnakeCase(k)] = _args[k]; return acc;}, {});

      const cs = new pg.helpers.ColumnSet(
        Object.keys(args).map(arg => ({ name: arg, mod: fields[snakeToCamelCase(arg)].metadata.mod })),
        { table: tableName }
      );
      log.debug(JSON.stringify({ args, cs }, null, 2));

      let update: string = '';
      try {

        update = `${pg.helpers.update(args, cs)} WHERE ${whereArgs} RETURNING ${dbFields.join(', ')}`;
      } catch (err) {
        console.error(err);
      }

      
      log.debug({ update });
      return flattenSqlValues(await db.query(update));
    },
    filter: async (args: any) => {
      const { db, pg } = this;
      const fields = this.getFields();
      const tableName = this.getTableName();

      const dbFields = aliasSqlFields(fields, tableName);
      const whereArgs = whereSqlFields(pg)(args, tableName);
      const joinFields = this.getJoinFields();

      const query = `SELECT ${[...dbFields, ...joinFields].join(', ')} FROM ${tableName} ${this.getInnerJoin()} WHERE ${whereArgs}`;

      log.debug({ query, whereArgs });
      const rawRes = await db.any(query);
      const res = flattenSqlValues(rawRes);

      // res.update = (args) => this.objects.update(args, );
      return res;
    },
  }
}


export default Model;
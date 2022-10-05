/**
 * SQL base repository class
 */
import { IDatabase, IMain, ColumnSet } from 'pg-promise';
import { IResult } from 'pg-promise/typescript/pg-subset';

import BaseModel from '../models/Model';
import { ModelToType } from '../types';

// db: IDatabase<any>, pg: IMain, model?: Model, options
type DbType = IDatabase<any>;
type PgType = IMain;
type TransformResultFunc<Result = { [key: string]: unknown }> = (_: { [key: string]: unknown }) => Result;


type ConstructorArgsOptions<Model, SQLQueries> = {
  db: DbType,
  pg: PgType,
  model?: Model,
  sql: SQLQueries,
  transformResult?: TransformResultFunc<ModelToType<Model>>,
};

type ConstructorArgsList<Model, SQLQueries> = [
  db: DbType,
  pg: PgType,
  model?: Model,
  sql?: SQLQueries,
  transformResult?: TransformResultFunc<ModelToType<Model>>,
];

type SQLQueriesDefault = {
  create?: string,
  drop?: string,
  empty?: string,
  remove?: string,
  find?: string,
  all?: string,
  total?: string,
};

const getKeyValFromArg = (argObj: { [key: string]: unknown }) => {
  const args = Object.entries(argObj);

  if (args.length === 1) {
    const [k, v] = args;

    return [k, v];
  }

  return null;
}

class SQLRepository<Model extends BaseModel, SQLQueries extends SQLQueriesDefault = SQLQueriesDefault> {
  cs?: ColumnSet<unknown>
  model?: BaseModel;
  db: DbType;
  pg: PgType;
  sql?: SQLQueries;
  transformResult?: TransformResultFunc<ModelToType<Model>>;

  constructor(args: ConstructorArgsList<Model, SQLQueries> | ConstructorArgsOptions<Model, SQLQueries>) {
    const [db, pg, model, sql, transformResult] = Array.isArray(args) ? args : [args.db, args.pg, args.model, args.sql, args.transformResult]
    this.db = db;
    this.pg = pg;
    if (model) {
      this.model = model;
    }
    if (sql) {
      this.sql = sql;
    }
    if (transformResult) {
      this.transformResult = transformResult;
    }
  }

  private warnNotInstantiated() {
    console.warn('SQL repository not correctly instantiated. Please check constructor arguments.');
    return null;
  }
  // sql: SQLQueries = undefined;

  filterDataArgs(data: { [key: string]: unknown }) {
    const filteredData: ModelToType<Model> = Object.keys(data)
      .filter((k) => this.model && Object.keys(this.model.getFields()).includes(k))
      .reduce((acc: any, k: string) => {
        acc[k] = data[k]

        return acc;
      }, {}) as ModelToType<Model>;
    
    return filteredData;
  }

   async findByArgument(args: { [key: string]: unknown }, transformFunc: (data: unknown) => ModelToType<Model>) {
    if (Object.entries(args).length !== 1) {
      return null;
    }
    const res = await this.model?.objects.get(args);
    if (!res) {
      return null;
    }
    return transformFunc(res);
  }

  async create(): Promise<null> {
    if (this.sql?.create) {
      return this.db.none(this.sql.create);
    }
    return this.warnNotInstantiated();
  }
  async drop(): Promise<null> {
    if (this.sql?.drop) {
      return this.db.none(this.sql.drop);
    }
    return this.warnNotInstantiated();
  }
  async empty(): Promise<null> {
    if (this.sql?.empty) {
      return this.db.none(this.sql.empty);
    }
    return this.warnNotInstantiated();
  }
  async add(data: ModelToType<Model>): Promise<ModelToType<Model> | null> {
    if (!this.transformResult || !this.model) {
      return this.warnNotInstantiated();
    }
    const filteredData = this.filterDataArgs(data);

    return this.transformResult(await this.model.objects.create(filteredData));
  }
  async bulkAdd(items: ModelToType<Model>[]): Promise<unknown> {
    if (!this.model) {
      return this.warnNotInstantiated();
    }
    return this.model.objects.bulkCreate(items);
  }
  async removeByIndex(id: number): Promise<number | null> {
    return this.remove({ id });
  }

  async find(arg: { [key: string]: unknown }) {
    const [fieldName, fieldValue] = getKeyValFromArg(arg) || [];
    if (this.sql?.find && fieldName && fieldValue) {
      return this.db.oneOrNone(this.sql.find, [fieldName, fieldValue])
    }

    return await this.model?.objects.get(arg) || this.warnNotInstantiated();
  }

  async remove(arg: { [key: string]: unknown }): Promise<number | null> {
    const [fieldName, fieldValue] = getKeyValFromArg(arg) || [];
    if (this.sql?.remove && fieldName && fieldValue) {
      return this.db.result(this.sql.remove, [fieldName, fieldValue], (r: IResult) => r.rowCount);
    }
    return this.model?.objects.delete(arg) || this.warnNotInstantiated();
  }

  async all(): Promise<ModelToType<Model>[] | null> {
    if (this.sql?.all) {
      return this.db.oneOrNone(this.sql.all)
    }
    if (this.model && this.transformResult) {
      return (await this.model.objects.all<{ users: ModelToType<Model> }[]>()).map(this.transformResult);
    }
 
    return this.warnNotInstantiated();
   }
   async total(): Promise<number | null> {
    if (this.sql?.total) {
      return this.db.one(this.sql.total, [], (a: { count: string }) => +a.count)
    }
    if (this.model) {
      return this.model.objects.total();
    }
    return this.warnNotInstantiated();
   }
}

export default SQLRepository;

import * as models from './models';

import { camelToSnakeCase, snakeToCamelCase } from './utils';

const getRepository = (Entity: /*typeof models.Model*/any, db: any, pg: any) => {
  const instance = new Entity(db, pg);

  return instance;
}

const skipIfNull = (name: string) => ({ name, skip: (c: any) => c.value === null });

/** @deprecated
 * Use models.Model
 */
export const Model = models.Model;

export {
  models, getRepository, skipIfNull,
  camelToSnakeCase, snakeToCamelCase
};

export { default as SQLRepository } from './repos/sql-repository';

export type {
  SnakeToCamelCase,
  CamelToSnakeCase,
  ModelToSnakeCase,
  ModelToType,
} from './types';

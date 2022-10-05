import Model from '../Model';

export type ForeignKeyTo = string | typeof Model;

export type FieldMetadata = {
  __jsType?: unknown,
  __redisType?: unknown,
  type: string,
  constraints: string[],
  to?: ForeignKeyTo,
  toInstance?: any,
  value?: any,
  mod?: string,
};

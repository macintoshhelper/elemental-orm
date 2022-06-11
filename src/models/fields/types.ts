import Model from '../Model';

export type FieldMetadata = {
  type: string,
  constraints: string[],
  to?: string | typeof Model,
  toInstance?: any,
  value?: any,
  mod?: string,
};

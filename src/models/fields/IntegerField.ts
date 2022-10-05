import Field, { FieldOptions } from '../Field';
import { FieldMetadata } from './types';

export type IntegerFieldMetadata = FieldMetadata & {
  __jsType: 'number',
};


export class IntegerField extends Field {
  metadata: IntegerFieldMetadata = {
    __jsType: 'number',
    type: 'INTEGER',
    constraints: [],
  };

  constructor(options: FieldOptions) {
    super(options);
  }
}

export default (options?: any) => new IntegerField(options);

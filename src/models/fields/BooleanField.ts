import Field, { FieldOptions } from '../Field';
import { FieldMetadata } from './types';

type BooleanFieldMetadata = FieldMetadata & { __jsType: 'boolean' };

class BooleanField extends Field {
  metadata: BooleanFieldMetadata = {
    __jsType: 'boolean',
    type: 'BOOLEAN',
    constraints: [],
  };

  constructor(options?: FieldOptions) {
    super(options);
  }
}

export default (options?: any) => new BooleanField(options);

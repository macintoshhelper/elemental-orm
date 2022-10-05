import Field, { FieldOptions } from '../Field';
import { FieldMetadata } from './types';

type TextArrayFieldMetadata = FieldMetadata & { __jsType: 'string[]' };

class TextArrayField extends Field {
  metadata: TextArrayFieldMetadata = {
    __jsType: 'string[]',
    type: 'TEXT[]',
    constraints: [],
    // mod: ':value',
  };

  constructor(options: FieldOptions) {
    super(options);
  }
}

export default (options?: any) => new TextArrayField(options);

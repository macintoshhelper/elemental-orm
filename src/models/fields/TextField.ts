import Field, { FieldOptions } from '../Field';
import { FieldMetadata } from './types';

type TextFieldMetadata = FieldMetadata & { __jsType: 'string' };

class TextField extends Field {
  metadata: TextFieldMetadata = {
    __jsType: 'string',
    type: 'TEXT',
    constraints: [],
    // mod: ':value',
  };

  constructor(options: FieldOptions) {
    super(options);
  }
}

export default (options?: any) => new TextField(options);

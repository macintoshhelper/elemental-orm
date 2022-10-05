import Field from '../Field';
import { FieldMetadata } from './types';

type JSONFieldMetadata = FieldMetadata & { __jsType: 'string' };

class JSONField extends Field {
  metadata: JSONFieldMetadata = {
    __jsType: 'string',
    type: 'JSONB',
    constraints: [],
    mod: ':json',
  };

  constructor(options: any) {
    super(options);
  }
}

export default (options?: any) => new JSONField(options);

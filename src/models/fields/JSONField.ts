import Field from '../Field';
import { FieldMetadata } from './types';

class JSONField extends Field {
  metadata: FieldMetadata = {
    type: 'JSONB',
    constraints: [],
    mod: ':json',
  };

  constructor(options: any) {
    super(options);
  }
}

export default (options?: any) => new JSONField(options);

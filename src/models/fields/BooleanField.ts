import Field from '../Field';
import { FieldMetadata } from './types';

class JSONField extends Field {
  metadata: FieldMetadata = {
    type: 'BOOLEAN',
    constraints: [],
  };

  constructor(options?: any) {
    super(options);
  }
}

export default (options?: any) => new JSONField(options);

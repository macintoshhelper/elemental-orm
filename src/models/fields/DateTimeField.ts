import Field from '../Field';
import { FieldMetadata } from './types';

class DateTimeField extends Field {
  metadata: FieldMetadata = {
    type: 'timestamptz',
    constraints: [],
    // mod: ':value',
  };

  constructor(options?: any) {
    super(options);
  }
}

export default (options?: any) => new DateTimeField(options);

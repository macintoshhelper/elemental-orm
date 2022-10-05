import Field, { FieldOptions } from '../Field';
import { FieldMetadata } from './types';

type DateTimeFieldMetadata = FieldMetadata & { __jsType: 'date' };

class DateTimeField extends Field {
  metadata: DateTimeFieldMetadata = {
    __jsType: 'date',
    type: 'timestamptz',
    constraints: [],
    // mod: ':value',
  };

  constructor(options?: FieldOptions) {
    super(options);
  }
}

export default (options?: any) => new DateTimeField(options);

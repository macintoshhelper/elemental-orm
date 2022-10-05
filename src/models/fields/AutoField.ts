import { FieldOptions } from '../Field';
import { IntegerField } from './IntegerField';
import { FieldMetadata } from './types';

type AutoFieldMetadata = FieldMetadata & { __jsType: 'number' };
type AutoFieldOptions = FieldOptions & {};

export class AutoField extends IntegerField {
  metadata: AutoFieldMetadata = {
    __jsType: 'number',
    type: 'SERIAL',
    constraints: [],
  };

  constructor(options: AutoFieldOptions) {
    super(options);
  }
}

export default (options: AutoFieldOptions = {}) => new AutoField(options);

import { IntegerField } from './IntegerField';
import { FieldMetadata } from './types';


export class AutoField extends IntegerField {
  metadata: FieldMetadata = {
    type: 'SERIAL',
    constraints: [],
  };

  constructor(options: any) {
    super(options);
  }
}

export default (options?: any) => new AutoField(options);

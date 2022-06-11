import Field from '../Field';
import { FieldMetadata } from './types';

class TextField extends Field {
  metadata: FieldMetadata = {
    type: 'TEXT',
    constraints: [],
    // mod: ':value',
  };

  constructor(options: any) {
    super(options);
  }
}

export default (options?: any) => new TextField(options);

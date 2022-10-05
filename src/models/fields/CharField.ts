import Field from '../Field';
import { FieldMetadata } from './types';

type CharFieldMetadata = FieldMetadata & { __jsType: 'string' };

class CharField extends Field {
  metadata: CharFieldMetadata = {
    __jsType: 'string',
    type: 'VARCHAR(255)', // FIXME: Safety mechanism/warning if maxLength option is missing
    constraints: [],
    // mod: ':value',
  };

  constructor(options: { maxLength: number }) {
    super(options as any);

    if (options.maxLength && options.maxLength <= 255) {
      this.metadata.type = `VARCHAR(${options.maxLength})`
    }
  }
}

export default (options?: any) => new CharField(options);

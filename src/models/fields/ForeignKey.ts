import { IntegerField } from './IntegerField';
import { FieldMetadata } from './types';

class ForeignKey extends IntegerField {
  metadata: FieldMetadata = {
    type: 'INTEGER REFERENCES',
    to: '',
    constraints: [],
  };

  constructor(options: FieldMetadata) {
    super(options);

    if (typeof options.to === 'object') {
      const toInstance = options.to;

      // @ts-ignore
      this.metadata.to = toInstance.getTableName();
      this.metadata.toInstance = toInstance;
    }
    if (typeof options.to === 'string') {
      this.metadata.to = options.to;
    }
  }

  createSql() {
    return `${this.metadata.type} ${this.metadata.to}(id)`;
  }
}

export default (to: string, options?: any) => new ForeignKey({ to, ...options });

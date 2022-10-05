import { FieldOptions } from '../Field';
import { IntegerField, IntegerFieldMetadata } from './IntegerField';
import { FieldMetadata, ForeignKeyTo } from './types';

class ForeignKey extends IntegerField {
  metadata: IntegerFieldMetadata = {
    __jsType: 'number',
    type: 'INTEGER REFERENCES',
    to: '',
    constraints: [],
  };

  constructor(options: FieldOptions & FieldMetadata) {
    const { to, ...baseOptions } = options;
    super(baseOptions);

    if (typeof options.to === 'function') {
      const toInstance = new options.to({} as any, {} as any);

      this.metadata.to = toInstance.getTableName();
      this.metadata.toInstance = toInstance;
    }
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

export default (to: ForeignKeyTo, options?: any) => new ForeignKey({ to, ...options });

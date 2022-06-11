import Field from '../Field';

export class IntegerField extends Field {
  constructor(options: any) {
    super(options);
  }

  dbType() {
    return 'INTEGER';
  }
}

export default (options?: any) => new IntegerField(options);

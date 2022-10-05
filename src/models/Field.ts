import { FieldMetadata } from './fields/types';

type ChoiceKey = string;
type ChoiceValue = string;

type Choices = [ChoiceKey, ChoiceValue][];

// interface FieldType {

// }

type NullOption = boolean;
type BlankOption = boolean;
type DbColumnOption = string;

type EditableOption = boolean;

export type FieldOptions = { 
  null?: NullOption, blank?: BlankOption, primary_key?: boolean, choices?: Choices, redisType?: string,
};

class Field {
  null?: NullOption = false;
  blank?: BlankOption = false;
  choices?: Choices = undefined;
  db_column?: any;
  db_index?: any;
  db_tablespace?: any;
  default?: any;
  editable?: EditableOption = true;
  error_messages?: any;
  help_text?: any;
  primary_key?: boolean;
  unique?: boolean;
  unique_for_date?: any;
  unique_for_month?: any;
  unique_for_year?: any;
  verbose_name?: any;
  validators?: any;

  metadata?: FieldMetadata/*{
    type: '',
    constraints: [],
    value: null,
    mod: 'text',
  }*/;

  constructor({
    null: nullVal,
    blank,
    choices,
    primary_key,
    redisType,
  }: FieldOptions = {}) {
    this.null = nullVal;
    this.blank = blank;
    this.primary_key = primary_key;
    this.choices = choices;

    if (redisType && this.metadata) {
      this.metadata.__redisType = redisType;
    }
  }

  createSql() {
    if (!this.metadata) {
      return;
    }
    const { type } = this.metadata;
    const constraints = [...this.metadata.constraints];

    if (this.primary_key) {
      constraints.push('PRIMARY KEY');
    }
    return [type, constraints.join(' ')].filter(i => i).join(' ');
  }
}

export default Field;

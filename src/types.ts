export type SnakeToCamelCase<Key extends string> = Key extends `${infer FirstPart}_${infer FirstLetter}${infer LastPart}`
  ? `${FirstPart}${Uppercase<FirstLetter>}${SnakeToCamelCase<LastPart>}`
  : Key;

export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}` ?
  `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}` :
  S

type ExcludeProps = '__meta' | 'getTableName' | 'objects' | 'save'
  | 'Meta' | 'getMeta' | 'getFields' | 'getPrimaryKeyFields'
  | 'getJoinFields' | 'getInnerJoin' | 'getCs';

// `get${Capitalize<string & Property>}`
// Exclude<Property, ExcludeProps>

type ModelTypeMapping<Type> = Type extends { metadata: { __jsType: 'string' } }
  ? string
  : Type extends { metadata: { __jsType: 'number' } }
    ? number
    : Type extends { metadata: { __jsType: 'boolean' } }
      ? boolean
      : Type extends { metadata: { __jsType: 'date' } }
        ? Date
        : unknown;

export type ModelToSnakeCase<Type> = {
  [Property in keyof Type as `${CamelToSnakeCase<string & Exclude<Property, ExcludeProps>>}`]: ModelTypeMapping<Type[Property]>;
}

export type ModelToType<Type> = {
  [Property in keyof Type as `${string & Exclude<Property, ExcludeProps>}`]: ModelTypeMapping<Type[Property]>;
}

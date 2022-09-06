import * as models from './models';

const getRepository = (Entity: /*typeof models.Model*/any, db: any, pg: any) => {
  const instance = new Entity(db, pg);

  return instance;
}

const skipIfNull = (name: string) => ({ name, skip: (c: any) => c.value === null });

export { models, getRepository, skipIfNull };

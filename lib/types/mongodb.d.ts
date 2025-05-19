import { MongoClient } from 'mongodb';

declare global {
  let _mongoClientPromise: Promise<MongoClient>;

  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: never | null;
        promise: Promise<never> | null;
      };
    }
  }
}

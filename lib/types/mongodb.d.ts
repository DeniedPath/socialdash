import { MongoClient } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
  
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: any | null;
        promise: Promise<any> | null;
      };
    }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import Firebird from 'node-firebird';
import { dbOptionsGen } from '../config/database';

export default {
  query(
    query: string,
    callback: (err: any, result: any[]) => void,
  ) {
    Firebird.attach(dbOptionsGen(), (err, db) => {
      if (err) {
        return callback(err, []);
      }

      db.query(query, [], (err, result) => {
        db.detach();

        if (err) {
          return callback(err, []);
        }

        callback(null, result);
      });
    });
  }
};

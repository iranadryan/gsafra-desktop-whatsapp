import database from '../../database';
import { ICropDomain } from '../../types/CropTypes';
import CropMapper from './mappers/CropMapper';

class CropRepository {
  findAll() {
    return new Promise<ICropDomain[]>((resolve, reject) => {
      database.query(`
      select * from cultura
      where cultura.cultura = 1
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result.map((crop) => CropMapper.toDomain(crop)));
      });
    });
  }

  findById(id: number) {
    return new Promise<ICropDomain | null>((resolve, reject) => {
      database.query(`
      select * from cultura
      where cultura.cultura = 1
      and id = ${id}
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result[0] ? CropMapper.toDomain(result[0]) : null);
      });
    });
  }
}

export default new CropRepository();

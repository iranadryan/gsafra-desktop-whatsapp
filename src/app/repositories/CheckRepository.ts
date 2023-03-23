import moment from 'moment';
import database from '../../database';
import CheckMapper from './mappers/CheckMapper';
import { ITodayChecksDomain } from '../../types/CheckTypes';

class CheckRepository {
  findTodayChecks() {
    return new Promise<ITodayChecksDomain[]>((resolve, reject) => {
      database.query(`
      select
        sum(cheque.valor) as valor,
        pessoa.razao_social
      from cheque
      inner join pessoa on pessoa.id = cheque.id_pessoa
      where cheque.situacao = 'A'
      and cheque.data_vencimento = '${moment().format('MM/DD/YYYY')}'
      group by pessoa.razao_social
      order by valor desc
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result.map((payment) => (
          CheckMapper.toTodayChecksDomain(payment)
        )));
      });
    });
  }
}

export default new CheckRepository();

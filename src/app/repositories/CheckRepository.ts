import moment from 'moment';
import database from '../../database';
import CheckMapper from './mappers/CheckMapper';
import { IChecksDomain } from '../../types/CheckTypes';

class CheckRepository {
  findTodayChecks(type: 'R' | 'P') {
    return new Promise<IChecksDomain[]>((resolve, reject) => {
      database.query(`
      select
        sum(cheque.valor) as valor,
        pessoa.razao_social
      from cheque
      inner join pessoa on pessoa.id = cheque.id_pessoa
      where cheque.situacao = 'A'
      and cheque.data_vencimento = '${moment().format('MM/DD/YYYY')}'
      and cheque.tipo = '${type === 'R' ? 'R' : 'E'}'
      group by pessoa.razao_social
      order by valor desc
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result.map((payment) => (
          CheckMapper.toChecksDomain(payment)
        )));
      });
    });
  }

  findPeriodChecks(type: 'R' | 'P', startDate: Date, endDate: Date) {
    return new Promise<IChecksDomain[]>((resolve, reject) => {
      database.query(`
      select
        sum(cheque.valor) as valor,
        pessoa.razao_social
      from cheque
      inner join pessoa on pessoa.id = cheque.id_pessoa
      where cheque.situacao = 'A'
      and cheque.data_vencimento >= '${moment(startDate).format('MM/DD/YYYY')}'
      and cheque.data_vencimento <= '${moment(endDate).format('MM/DD/YYYY')}'
      and cheque.tipo = '${type === 'R' ? 'R' : 'E'}'
      group by pessoa.razao_social
      order by valor desc
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result.map((payment) => (
          CheckMapper.toChecksDomain(payment)
        )));
      });
    });
  }
}

export default new CheckRepository();

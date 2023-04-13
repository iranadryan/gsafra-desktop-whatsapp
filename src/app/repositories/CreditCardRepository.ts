import moment from 'moment';
import database from '../../database';

class CreditCardRepository {
  findTodayTotal() {
    return new Promise<number>((resolve, reject) => {
      database.query(`
      select
        sum(cartao_pagar_d.valor) as total
      from cartao_pagar_d
      where cartao_pagar_d.situacao = 0
      and cartao_pagar_d.vencimento = '${moment().format('MM/DD/YYYY')}'
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result[0].TOTAL);
      });
    });
  }

  findPeriodTotal(startDate: Date, endDate: Date) {
    return new Promise<number>((resolve, reject) => {
      database.query(`
      select
        sum(cartao_pagar_d.valor) as total
      from cartao_pagar_d
      where cartao_pagar_d.situacao = 0
      and cartao_pagar_d.vencimento >= '${moment(startDate).format('MM/DD/YYYY')}'
      and cartao_pagar_d.vencimento <= '${moment(endDate).format('MM/DD/YYYY')}'
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result[0].TOTAL);
      });
    });
  }
}

export default new CreditCardRepository();

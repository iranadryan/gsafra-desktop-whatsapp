import moment from 'moment';
import database from '../../database';
import FinancialMapper from './mappers/FinancialMapper';
import { IPaymentsDomain } from '../../types/FinancialTypes';

class FinancialRepository {
  findTodayFinancial(type: 'R' | 'P') {
    return new Promise<IPaymentsDomain[]>((resolve, reject) => {
      database.query(`
      select
        sum(
          conta_receber_pagar.valor_parcela -
          conta_receber_pagar.total_pago +
          conta_receber_pagar.total_multa +
          conta_receber_pagar.total_juros -
          conta_receber_pagar.total_desconto
        ) as valor,
        pessoa.razao_social
      from conta_receber_pagar
      inner join crp_m on crp_m.id = conta_receber_pagar.id_crp_m
      inner join pessoa on pessoa.id = crp_m.id_pessoa
      where conta_receber_pagar.situacao = 'A'
      and conta_receber_pagar.data_vencimento = '${moment().format('MM/DD/YYYY')}'
      and crp_m.tipo = ${type === 'R' ? 1 : 2}
      group by pessoa.razao_social
      order by valor desc
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result.map((payment) => (
          FinancialMapper.toPaymentsDomain(payment)
        )));
      });
    });
  }

  findPeriodFinancial(type: 'R' | 'P', startDate: Date, endDate: Date) {
    return new Promise<IPaymentsDomain[]>((resolve, reject) => {
      database.query(`
      select
        sum(
          conta_receber_pagar.valor_parcela -
          conta_receber_pagar.total_pago +
          conta_receber_pagar.total_multa +
          conta_receber_pagar.total_juros -
          conta_receber_pagar.total_desconto
        ) as valor,
        pessoa.razao_social
      from conta_receber_pagar
      inner join crp_m on crp_m.id = conta_receber_pagar.id_crp_m
      inner join pessoa on pessoa.id = crp_m.id_pessoa
      where conta_receber_pagar.situacao = 'A'
      and conta_receber_pagar.data_vencimento >= '${moment(startDate).format('MM/DD/YYYY')}'
      and conta_receber_pagar.data_vencimento <= '${moment(endDate).format('MM/DD/YYYY')}'
      and crp_m.tipo = ${type === 'R' ? 1 : 2}
      group by pessoa.razao_social
      order by valor desc
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result.map((payment) => (
          FinancialMapper.toPaymentsDomain(payment)
        )));
      });
    });
  }
}

export default new FinancialRepository();

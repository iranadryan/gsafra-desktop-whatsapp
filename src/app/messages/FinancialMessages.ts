import moment from 'moment';
import { IChecksDomain } from '../../types/CheckTypes';
import { IPaymentsDomain } from '../../types/FinancialTypes';
import { formatCurrency } from '../../utils/formatCurrency';

interface IPaymentsAccountArgs {
  payments: IPaymentsDomain[];
  checks: IChecksDomain[];
  creditCardTotal: number;
}

interface IPaymentsPeriodAccountArgs {
  payments: IPaymentsDomain[];
  checks: IChecksDomain[];
  creditCardTotal: number;
  startDate: Date;
  endDate: Date;
}

interface IReceivablesAccountArgs {
  receivables: IPaymentsDomain[];
  checks: IChecksDomain[];
}

interface IReceivablesPeriodAccountArgs {
  receivables: IPaymentsDomain[];
  checks: IChecksDomain[];
  startDate: Date;
  endDate: Date;
}

export const paymentsAccountMessage = ({
  payments,
  checks,
  creditCardTotal
}: IPaymentsAccountArgs) => `
${payments.length > 0 ? `*📝 CONTAS A PAGAR*
${moment().weekday() !== 1 ? `_Contas a pagar com o vencimento na data de hoje: *${moment().format('DD/MM/YYYY')}*_` : `_Contas a pagar com vencimento de sábado à hoje: *${moment().subtract(2, 'day').format('DD/MM/YYYY')} - ${moment().format('DD/MM/YYYY')}*_`}
${payments.map((payment) => (`
*${payment.supplierName}*
${formatCurrency(payment.value)}
`)).join('').trimEnd()}` : ''}

${checks.length > 0 ? `*🧾 CHEQUES A COMPENSAR*
${moment().weekday() !== 1 ? `_Cheques com o vencimento na data de hoje: *${moment().format('DD/MM/YYYY')}*_` : `_Cheques com vencimento de sábado à hoje: *${moment().subtract(2, 'day').format('DD/MM/YYYY')} - ${moment().format('DD/MM/YYYY')}*_`}
${checks.map((check) => (`
*${check.supplierName}*
${formatCurrency(check.value)}
`)).join('').trimEnd()}` : ''}

${creditCardTotal > 0 ? `*💳 CARTÃO DE CRÉDITO*
_Fatura total com o vencimento na data de hoje:  *${moment().format('DD/MM/YYYY')}*_

${formatCurrency(creditCardTotal)}` : ''}
`.trim();

export const paymentsPeriodAccountMessage = ({
  payments,
  checks,
  creditCardTotal,
  startDate,
  endDate
}: IPaymentsPeriodAccountArgs) => `
*📝 CONTAS A PAGAR*
_Contas a pagar com o vencimento no período de: *${moment(startDate).format('DD/MM/YYYY')}* à *${moment(endDate).format('DD/MM/YYYY')}*_
${payments.map((payment) => (`
*${payment.supplierName}*
${formatCurrency(payment.value)}
`)).join('').trimEnd()}${payments.length === 0 ? '\n_*NENHUMA CONTA A PAGAR*_' : ''}

*🧾 CHEQUES A COMPENSAR*
_Cheques com o vencimento no período de: *${moment(startDate).format('DD/MM/YYYY')}* à *${moment(endDate).format('DD/MM/YYYY')}*_
${checks.map((check) => (`
*${check.supplierName}*
${formatCurrency(check.value)}
`)).join('').trimEnd()}${checks.length === 0 ? '\n_*NENHUM CHEQUE A COMPENSAR*_' : ''}

*💳 CARTÃO DE CRÉDITO*
_Fatura total com o vencimento no período de: *${moment(startDate).format('DD/MM/YYYY')}* à *${moment(endDate).format('DD/MM/YYYY')}*_

${formatCurrency(creditCardTotal)}
`.trim();

export const receivablesAccountMessage = ({
  receivables,
  checks,
}: IReceivablesAccountArgs) => `
${receivables.length > 0 ? `*📝 CONTAS A RECEBER*
${moment().weekday() !== 1 ? `_Contas a receber com o vencimento na data de hoje: *${moment().format('DD/MM/YYYY')}*_` : `_Contas a receber com vencimento de sábado à hoje: *${moment().subtract(2, 'day').format('DD/MM/YYYY')} - ${moment().format('DD/MM/YYYY')}*_`}
${receivables.map((payment) => (`
*${payment.supplierName}*
${formatCurrency(payment.value)}
`)).join('').trimEnd()}` : ''}

${checks.length > 0 ? `*🧾 CHEQUES EMITIDOS*
${moment().weekday() !== 1 ? `_Cheques com o vencimento na data de hoje: *${moment().format('DD/MM/YYYY')}*_` : `_Cheques com vencimento de sábado à hoje: *${moment().subtract(2, 'day').format('DD/MM/YYYY')} - ${moment().format('DD/MM/YYYY')}*_`}
${checks.map((check) => (`
*${check.supplierName}*
${formatCurrency(check.value)}
`)).join('').trimEnd()}` : ''}
`.trim();

export const receivablesPeriodAccountMessage = ({
  receivables,
  checks,
  startDate,
  endDate
}: IReceivablesPeriodAccountArgs) => `
*📝 CONTAS A RECEBER*
_Contas a receber com o vencimento no período de: *${moment(startDate).format('DD/MM/YYYY')}* à *${moment(endDate).format('DD/MM/YYYY')}*_
${receivables.map((payment) => (`
*${payment.supplierName}*
${formatCurrency(payment.value)}
`)).join('').trimEnd()}${receivables.length === 0 ? '\n_*NENHUMA CONTA A RECEBER*_' : ''}

*🧾 CHEQUES EMITIDOS*
_Cheques com o vencimento no período de: *${moment(startDate).format('DD/MM/YYYY')}* à *${moment(endDate).format('DD/MM/YYYY')}*_
${checks.map((check) => (`
*${check.supplierName}*
${formatCurrency(check.value)}
`)).join('').trimEnd()}${checks.length === 0 ? '\n_*NENHUM CHEQUE EMITIDO*_' : ''}
`.trim();

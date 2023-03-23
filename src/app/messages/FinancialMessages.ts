import moment from 'moment';
import { ITodayChecksDomain } from '../../types/CheckTypes';
import { ITodayPaymentsDomain } from '../../types/FinancialTypes';
import { formatCurrency } from '../../utils/formatCurrency';

interface IPaymentsAccountArgs {
  payments: ITodayPaymentsDomain[];
  checks: ITodayChecksDomain[];
  creditCardTotal: number;
}

export const paymentsAccountMessage = ({
  payments,
  checks,
  creditCardTotal
}: IPaymentsAccountArgs) => `
*📝 CONTAS A PAGAR*
_Contas a pagar com o vencimento na data de hoje: *${moment().format('DD/MM/YYYY')}*_
${payments.map((payment) => (`
*${payment.supplierName}*
${formatCurrency(payment.value)}
`)).join('').trimEnd()}${payments.length === 0 ? '\n_*NENHUMA CONTA A PAGAR*_' : ''}

*🧾 CHEQUES A COMPENSAR*
_Cheques com o vencimento na data de hoje: *${moment().format('DD/MM/YYYY')}*_
${checks.map((check) => (`
*${check.supplierName}*
${formatCurrency(check.value)}
`)).join('').trimEnd()}${checks.length === 0 ? '\n_*NENHUM CHEQUE A COMPENSAR*_' : ''}

*💳 CARTÃO DE CRÉDITO*
_Fatura total com o vencimento na data de hoje:  *${moment().format('DD/MM/YYYY')}*_

${formatCurrency(creditCardTotal)}
`.trim();

import moment from 'moment';
import { messageSuccessLog } from '../../utils/messageLogs';
import { sendTextMessage } from '../../utils/sendTextMessage';
import {
  paymentsAccountMessage,
  receivablesAccountMessage,
} from '../messages/FinancialMessages';
import CheckRepository from '../repositories/CheckRepository';
import CreditCardRepository from '../repositories/CreditCardRepository';
import FinancialRepository from '../repositories/FinancialRepository';
import NotificationRepository from '../repositories/NotificationRepository';

class FinancialMessageController {
  async sendPaymentsAccountMessage() {
    const contacts = await NotificationRepository.findContactsNotification(
      'contas_pagar'
    );

    if (contacts.length === 0) {
      return;
    }

    const payments = await FinancialRepository.findTodayFinancial('P');
    const checks = await CheckRepository.findTodayChecks('P');
    const creditCardTotal = await CreditCardRepository.findTodayTotal();
    const weekendPayments = moment().weekday() === 1 ? await FinancialRepository.findPeriodFinancial('P', moment().subtract(2, 'day').toDate(), moment().subtract(1, 'day').toDate()) : [];
    const weekendChecks = moment().weekday() === 1 ? await CheckRepository.findPeriodChecks('P', moment().subtract(2, 'day').toDate(), moment().subtract(1, 'day').toDate()) : [];

    if (
      payments.length === 0
      && checks.length === 0
      && weekendPayments.length === 0
      && weekendChecks.length === 0
      && creditCardTotal === 0
    ) {
      return;
    }

    const message = paymentsAccountMessage({
      payments: [...weekendPayments, ...payments],
      checks: [...weekendChecks, ...checks],
      creditCardTotal,
    });

    for (const contact of contacts) {
      await sendTextMessage(contact, message);
    }

    messageSuccessLog('Contas a Pagar', contacts);
  }

  async sendReceivablesAccountMessage() {
    const contacts = await NotificationRepository.findContactsNotification(
      'contas_receber'
    );

    if (contacts.length === 0) {
      return;
    }

    const receivables = await FinancialRepository.findTodayFinancial('R');
    const checks = await CheckRepository.findTodayChecks('R');
    const weekendReceivables = moment().weekday() === 1 ? await FinancialRepository.findPeriodFinancial('R', moment().subtract(2, 'day').toDate(), moment().subtract(1, 'day').toDate()) : [];
    const weekendChecks = moment().weekday() === 1 ? await CheckRepository.findPeriodChecks('R', moment().subtract(2, 'day').toDate(), moment().subtract(1, 'day').toDate()) : [];

    if (
      receivables.length === 0
      && checks.length === 0
      && weekendReceivables.length === 0
      && weekendChecks.length === 0
    ) {
      return;
    }

    const message = receivablesAccountMessage({
      receivables: [...weekendReceivables, ...receivables],
      checks: [...weekendChecks, ...checks],
    });

    for (const contact of contacts) {
      await sendTextMessage(contact, message);
    }

    messageSuccessLog('Contas a Receber', contacts);
  }
}

export default new FinancialMessageController();

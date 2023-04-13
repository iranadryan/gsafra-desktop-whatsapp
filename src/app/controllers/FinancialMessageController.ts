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

    const message = paymentsAccountMessage({
      payments,
      checks,
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

    const message = receivablesAccountMessage({
      receivables,
      checks,
    });

    for (const contact of contacts) {
      await sendTextMessage(contact, message);
    }

    messageSuccessLog('Contas a Receber', contacts);
  }
}

export default new FinancialMessageController();

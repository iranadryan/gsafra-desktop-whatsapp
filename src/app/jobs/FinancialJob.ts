import cron from 'node-cron';
import axios from 'axios';

import FinancialRepository from '../repositories/FinancialRepository';
import CreditCardRepository from '../repositories/CreditCardRepository';
import CheckRepository from '../repositories/CheckRepository';
import NotificationRepository from '../repositories/NotificationRepository';
import { paymentsAccountMessage, receivablesAccountMessage } from '../messages/FinancialMessages';
import { messageSuccessLog } from '../../utils/messageLogs';
import { sendTextMessageURL } from '../../config/whatsappApi';

// 0 8 * * 1-5 --> String cron que executa todos os dias úteis às 08:00
export const paymentsAccountJob = cron.schedule('0 8 * * 1-5', async () => {
  const contacts = await NotificationRepository.findContactsNotification('contas_pagar');

  if (contacts.length === 0) {
    return;
  }

  const payments = await FinancialRepository.findTodayFinancial('P');
  const checks = await CheckRepository.findTodayChecks('P');
  const creditCardTotal = await CreditCardRepository.findTodayTotal();

  const message = paymentsAccountMessage({
    payments,
    checks,
    creditCardTotal
  });

  for (const contact of contacts) {
    await axios({
      method: 'post',
      url: sendTextMessageURL,
      data: {
        id: contact,
        message
      }
    });
  }

  messageSuccessLog('Contas a Pagar', contacts);
}, {
  scheduled: false
});

export const receivablesAccountJob = cron.schedule('0 8 * * 1-5', async () => {
  const contacts = await NotificationRepository.findContactsNotification('contas_receber');

  if (contacts.length === 0) {
    return;
  }

  const receivables = await FinancialRepository.findTodayFinancial('R');
  const checks = await CheckRepository.findTodayChecks('R');

  const message = receivablesAccountMessage({
    receivables,
    checks
  });

  for (const contact of contacts) {
    await axios({
      method: 'post',
      url: sendTextMessageURL,
      data: {
        id: contact,
        message
      }
    });
  }

  messageSuccessLog('Contas a Receber', contacts);
}, {
  scheduled: false
});

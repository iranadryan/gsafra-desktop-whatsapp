import cron from 'node-cron';
import FinancialMessageController from '../controllers/FinancialMessageController';

// 0 8 * * 1-5 --> String cron que executa todos os dias úteis às 08:00
export const morningJob = cron.schedule('0 8 * * 1-5', async () => {
  await FinancialMessageController.sendPaymentsAccountMessage();
  await FinancialMessageController.sendReceivablesAccountMessage();
}, {
  scheduled: false
});

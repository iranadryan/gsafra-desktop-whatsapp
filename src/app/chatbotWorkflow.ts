import moment from 'moment';
import { initTerms } from '../config/chatbot';
import { socket } from '../lib/socket';
import { parseWhatsappNumber } from '../utils/parseWhatsappNumber';
import { sendTextMessage } from '../utils/sendTextMessage';
import {
  agricultureReportsMessage,
  endedMessage,
  endMessage,
  financialReportsMessage,
  mainMenuMessage,
  notFoundMessage,
  notPermittedMessage,
  periodMessage,
} from './messages/ChatbotMessages';
import { cropMessage } from './messages/CropMessages';
import {
  paymentsAccountMessage,
  paymentsPeriodAccountMessage,
  receivablesAccountMessage,
  receivablesPeriodAccountMessage,
} from './messages/FinancialMessages';
import {
  grainStockByCropMessage,
  grainStockByProducerMessage,
  grainStockByStorageMessage,
} from './messages/GrainStockMessages';
import ChatbotRepository from './repositories/ChatbotRepository';
import CheckRepository from './repositories/CheckRepository';
import CreditCardRepository from './repositories/CreditCardRepository';
import CropRepository from './repositories/CropRepository';
import FinancialRepository from './repositories/FinancialRepository';
import GrainStockRepository from './repositories/GrainStockRepository';

interface IChatbotWorkflowArgs {
  name: string;
  number: string;
  message: string;
}

interface IConversation {
  number: string;
  name: string;
  stage: string[];
}

let conversations: IConversation[] = [];

export async function chatbotWorkflow({
  name,
  number,
  message,
}: IChatbotWorkflowArgs) {
  const parsedNumber = parseWhatsappNumber(number);

  let conversationIndex = conversations.findIndex(
    (conversation) => conversation.number === number
  );
  let currentPage = '';

  if (initTerms.includes(message)) {
    if (conversationIndex === -1) {
      const newLength = conversations.push({
        name,
        number,
        stage: [],
      });

      conversationIndex = newLength - 1;
    } else {
      conversations[conversationIndex] = {
        name,
        number,
        stage: [],
      };
    }
  }

  if (conversationIndex === -1) {
    return await sendTextMessage(number, notFoundMessage);
  }

  if (
    conversations[conversationIndex].stage[
      conversations[conversationIndex].stage.length - 1
    ] === 'fim'
  ) {
    if (message === '1') {
      conversations[conversationIndex].stage = [];
    }

    if (message === '2') {
      message = 'v';
    }

    if (message === '3') {
      conversations = conversations.filter(
        (conversation) => conversation.number !== number
      );
      socket.emit('removeUser', number);

      return await sendTextMessage(number, endedMessage);
    }
  }

  if (message === 'v' && conversations[conversationIndex].stage.length > 1) {
    currentPage = conversations[conversationIndex].stage.slice(-2, -1)[0];
    conversations[conversationIndex].stage = conversations[
      conversationIndex
    ].stage.slice(0, -2);
  }

  const stage = conversations[conversationIndex].stage;

  if (stage.length === 0) {
    const modulesPermitted = await ChatbotRepository.findModulesPermitted(
      parsedNumber
    );

    conversations[conversationIndex].stage[0] = 'inicio';

    return await sendTextMessage(number, mainMenuMessage(modulesPermitted));
  }

  if (stage.length === 1 && stage[0] === 'inicio') {
    const modulesPermitted = await ChatbotRepository.findModulesPermitted(
      parsedNumber
    );
    const itemsPermitted = await ChatbotRepository.findItemsPermitted(
      parsedNumber
    );

    if (message === '1' || currentPage === 'financeiro') {
      if (!modulesPermitted.includes('FINANCEIRO')) {
        conversations[conversationIndex].stage.push('fim');

        return await sendTextMessage(number, notPermittedMessage);
      }

      conversations[conversationIndex].stage[1] = 'financeiro';

      return await sendTextMessage(
        number,
        financialReportsMessage(itemsPermitted)
      );
    }

    if (message === '2' || currentPage === 'agricultura') {
      if (!modulesPermitted.includes('AGRICULTURA')) {
        conversations[conversationIndex].stage.push('fim');

        return await sendTextMessage(number, notPermittedMessage);
      }

      conversations[conversationIndex].stage[1] = 'agricultura';

      return await sendTextMessage(
        number,
        agricultureReportsMessage(itemsPermitted)
      );
    }
  }

  if (stage.length === 2 && stage[1] === 'financeiro') {
    const itemsPermitted = await ChatbotRepository.findItemsPermitted(
      parsedNumber
    );

    if (message === '1' || currentPage === 'contas_pagar') {
      if (!itemsPermitted.includes('RELATORIO_CONTAS_PAGAR')) {
        conversations[conversationIndex].stage.push('fim');

        return await sendTextMessage(number, notPermittedMessage);
      }

      conversations[conversationIndex].stage[2] = 'contas_pagar';

      return await sendTextMessage(number, periodMessage);
    }

    if (message === '2' || currentPage === 'contas_receber') {
      if (!itemsPermitted.includes('RELATORIO_CONTAS_RECEBER')) {
        conversations[conversationIndex].stage.push('fim');

        return await sendTextMessage(number, notPermittedMessage);
      }

      conversations[conversationIndex].stage[2] = 'contas_receber';

      return await sendTextMessage(number, periodMessage);
    }
  }

  if (stage.length === 3 && stage[2] === 'contas_pagar') {
    if (message === '1') {
      const payments = await FinancialRepository.findTodayFinancial('P');
      const checks = await CheckRepository.findTodayChecks('P');
      const creditCardTotal = await CreditCardRepository.findTodayTotal();

      const message = paymentsAccountMessage({
        payments,
        checks,
        creditCardTotal,
      });

      conversations[conversationIndex].stage.push('fim');

      await sendTextMessage(number, message);
      return await sendTextMessage(number, endMessage);
    }

    if (message === '2') {
      const startDate = moment().toDate();
      const endDate = moment().add(6, 'days').toDate();

      const payments = await FinancialRepository.findPeriodFinancial(
        'P',
        startDate,
        endDate
      );
      const checks = await CheckRepository.findPeriodChecks(
        'P',
        startDate,
        endDate
      );
      const creditCardTotal = await CreditCardRepository.findPeriodTotal(
        startDate,
        endDate
      );

      const message = paymentsPeriodAccountMessage({
        payments,
        checks,
        creditCardTotal,
        startDate,
        endDate,
      });

      conversations[conversationIndex].stage.push('fim');

      await sendTextMessage(number, message);
      return await sendTextMessage(number, endMessage);
    }

    if (message === '3') {
      const startDate = moment().startOf('month').toDate();
      const endDate = moment().endOf('month').toDate();

      const payments = await FinancialRepository.findPeriodFinancial(
        'P',
        startDate,
        endDate
      );
      const checks = await CheckRepository.findPeriodChecks(
        'P',
        startDate,
        endDate
      );
      const creditCardTotal = await CreditCardRepository.findPeriodTotal(
        startDate,
        endDate
      );

      const message = paymentsPeriodAccountMessage({
        payments,
        checks,
        creditCardTotal,
        startDate,
        endDate,
      });

      conversations[conversationIndex].stage.push('fim');

      await sendTextMessage(number, message);
      return await sendTextMessage(number, endMessage);
    }
  }

  if (stage.length === 3 && stage[2] === 'contas_receber') {
    if (message === '1') {
      const receivables = await FinancialRepository.findTodayFinancial('R');
      const checks = await CheckRepository.findTodayChecks('R');

      const message = receivablesAccountMessage({
        receivables,
        checks,
      });

      conversations[conversationIndex].stage.push('fim');

      await sendTextMessage(number, message);
      return await sendTextMessage(number, endMessage);
    }

    if (message === '2') {
      const startDate = moment().toDate();
      const endDate = moment().add(6, 'days').toDate();

      const receivables = await FinancialRepository.findPeriodFinancial(
        'R',
        startDate,
        endDate
      );
      const checks = await CheckRepository.findPeriodChecks(
        'R',
        startDate,
        endDate
      );

      const message = receivablesPeriodAccountMessage({
        receivables,
        checks,
        startDate,
        endDate,
      });

      conversations[conversationIndex].stage.push('fim');

      await sendTextMessage(number, message);
      return await sendTextMessage(number, endMessage);
    }

    if (message === '3') {
      const startDate = moment().startOf('month').toDate();
      const endDate = moment().endOf('month').toDate();

      const receivables = await FinancialRepository.findPeriodFinancial(
        'R',
        startDate,
        endDate
      );
      const checks = await CheckRepository.findPeriodChecks(
        'R',
        startDate,
        endDate
      );

      const message = receivablesPeriodAccountMessage({
        receivables,
        checks,
        startDate,
        endDate,
      });

      conversations[conversationIndex].stage.push('fim');

      await sendTextMessage(number, message);
      return await sendTextMessage(number, endMessage);
    }
  }

  if (stage.length === 2 && stage[1] === 'agricultura') {
    const itemsPermitted = await ChatbotRepository.findItemsPermitted(
      parsedNumber
    );

    if (message === '1') {
      if (!itemsPermitted.includes('RELATORIO_ESTOQUE_GRAOS')) {
        conversations[conversationIndex].stage.push('fim');

        return await sendTextMessage(number, notPermittedMessage);
      }

      const cropsBalance = await GrainStockRepository.findAllByCrop();
      const filteredCropsBalance = cropsBalance.filter(
        (item) => item.balance > 0
      );

      const message = grainStockByCropMessage(filteredCropsBalance);

      conversations[conversationIndex].stage.push('fim');

      await sendTextMessage(number, message);
      return await sendTextMessage(number, endMessage);
    }

    if (message === '2' || currentPage === 'estoque_graos_cliente') {
      if (!itemsPermitted.includes('RELATORIO_ESTOQUE_GRAOS')) {
        conversations[conversationIndex].stage.push('fim');

        return await sendTextMessage(number, notPermittedMessage);
      }

      conversations[conversationIndex].stage.push('estoque_graos_cliente');

      const crops = await CropRepository.findAll();
      const message = cropMessage(crops);

      return await sendTextMessage(number, message);
    }

    if (message === '3' || currentPage === 'estoque_graos_silo') {
      if (!itemsPermitted.includes('RELATORIO_ESTOQUE_GRAOS')) {
        conversations[conversationIndex].stage.push('fim');

        return await sendTextMessage(number, notPermittedMessage);
      }

      conversations[conversationIndex].stage.push('estoque_graos_silo');

      const crops = await CropRepository.findAll();
      const message = cropMessage(crops);

      return await sendTextMessage(number, message);
    }
  }

  if (stage.length === 3 && stage[2] === 'estoque_graos_cliente') {
    const crop = await CropRepository.findById(Number(message) || 0);

    if (!crop) {
      return await sendTextMessage(
        number,
        'Por favor selecione uma safra da lista acima 😔'
      );
    }

    const producerBalance = await GrainStockRepository.findAllByProducer(
      crop.id
    );
    const filteredProducerBalance = producerBalance.filter(
      (item) => item.balance > 0
    );

    const producerBalanceMessage = grainStockByProducerMessage(
      filteredProducerBalance,
      crop.name
    );

    conversations[conversationIndex].stage.push('fim');

    await sendTextMessage(number, producerBalanceMessage);
    return await sendTextMessage(number, endMessage);
  }

  if (stage.length === 3 && stage[2] === 'estoque_graos_silo') {
    const crop = await CropRepository.findById(Number(message) || 0);

    if (!crop) {
      return await sendTextMessage(
        number,
        'Por favor selecione uma safra da lista acima 😃'
      );
    }

    const storageBalance = await GrainStockRepository.findAllByStorage(crop.id);
    const filteredStorageBalance = storageBalance.filter(
      (item) => item.balance > 0
    );
    const storageBalanceMessage = grainStockByStorageMessage(
      filteredStorageBalance,
      crop.name
    );

    conversations[conversationIndex].stage.push('fim');

    await sendTextMessage(number, storageBalanceMessage);
    return await sendTextMessage(number, endMessage);
  }
}

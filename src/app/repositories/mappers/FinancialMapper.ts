import {
  ITodayPaymentsPersistence,
  ITodayPaymentsDomain
} from '../../../types/FinancialTypes';

class FinancialMapper {
  toTodayPaymentsDomain(
    persistence: ITodayPaymentsPersistence
  ): ITodayPaymentsDomain {
    return {
      value: persistence.VALOR,
      supplierName: persistence.RAZAO_SOCIAL
    };
  }
}

export default new FinancialMapper();

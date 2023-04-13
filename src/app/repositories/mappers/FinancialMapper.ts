import {
  IPaymentsPersistence,
  IPaymentsDomain
} from '../../../types/FinancialTypes';

class FinancialMapper {
  toPaymentsDomain(
    persistence: IPaymentsPersistence
  ): IPaymentsDomain {
    return {
      value: persistence.VALOR,
      supplierName: persistence.RAZAO_SOCIAL.trim(),
    };
  }
}

export default new FinancialMapper();

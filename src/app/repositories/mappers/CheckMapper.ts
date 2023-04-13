import {
  IChecksPersistence,
  IChecksDomain
} from '../../../types/CheckTypes';

class CheckMapper {
  toChecksDomain(
    persistence: IChecksPersistence
  ): IChecksDomain {
    return {
      value: persistence.VALOR,
      supplierName: persistence.RAZAO_SOCIAL
    };
  }
}

export default new CheckMapper();

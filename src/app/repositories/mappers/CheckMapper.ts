import {
  ITodayChecksPersistence,
  ITodayChecksDomain
} from '../../../types/CheckTypes';

class CheckMapper {
  toTodayChecksDomain(
    persistence: ITodayChecksPersistence
  ): ITodayChecksDomain {
    return {
      value: persistence.VALOR,
      supplierName: persistence.RAZAO_SOCIAL
    };
  }
}

export default new CheckMapper();

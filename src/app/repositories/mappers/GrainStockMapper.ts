import {
  IGrainStockCropDomain,
  IGrainStockCropPersistence,
  IGrainStockProducerDomain,
  IGrainStockProducerPersistence,
  IGrainStockStorageDomain,
  IGrainStockStoragePersistence
} from '../../../types/GrainStockTypes';

class GrainStockMapper {
  toCropDomain(
    persistence: IGrainStockCropPersistence
  ): IGrainStockCropDomain {
    return {
      crop: persistence.CULTURA.trim(),
      balance: persistence.SALDO
    };
  }

  toProducerDomain(
    persistence: IGrainStockProducerPersistence
  ): IGrainStockProducerDomain {
    return {
      client: persistence.CLIENTE.trim(),
      balance: persistence.SALDO
    };
  }

  toStorageDomain(
    persistence: IGrainStockStoragePersistence
  ): IGrainStockStorageDomain {
    return {
      storage: persistence.SILO.trim(),
      balance: persistence.SALDO
    };
  }
}

export default new GrainStockMapper();

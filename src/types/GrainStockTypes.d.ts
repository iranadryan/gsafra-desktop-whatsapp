export interface IGrainStockCropPersistence {
  CULTURA: string;
  SALDO: number;
}

export interface IGrainStockCropDomain {
  crop: string;
  balance: number;
}

export interface IGrainStockProducerPersistence {
  CLIENTE: string;
  SALDO: number;
}

export interface IGrainStockProducerDomain {
  client: string;
  balance: number;
}

export interface IGrainStockStoragePersistence {
  SILO: string;
  SALDO: number;
}

export interface IGrainStockStorageDomain {
  storage: string;
  balance: number;
}

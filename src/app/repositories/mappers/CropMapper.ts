import { ICropDomain, ICropPersistence } from '../../../types/CropTypes';

class CropMapper {
  toDomain(
    persistence: ICropPersistence
  ): ICropDomain {
    return {
      id: persistence.ID,
      name: persistence.NOME.trim()
    };
  }
}

export default new CropMapper();

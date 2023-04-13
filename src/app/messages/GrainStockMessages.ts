import { IGrainStockCropDomain, IGrainStockProducerDomain, IGrainStockStorageDomain } from '../../types/GrainStockTypes';
import { formatNumber } from '../../utils/formatNumber';

export const grainStockByCropMessage = (cropsBalance: IGrainStockCropDomain[]) => `
*🌾 ESTOQUE DE GRÃOS POR CULTURA*
Saldo do estoque de grãos por *cultura*
${cropsBalance.map((cropBalance) => `
*${cropBalance.crop}*
${formatNumber(cropBalance.balance, ' Kg')} | ${formatNumber(cropBalance.balance / 60, ' Sacas')}
`).join('')}${cropsBalance.length === 0 ? '\n_*NENHUM ESTOQUE EM SILO*_' : ''}
`.trim();

export const grainStockByProducerMessage = (
  producersBalance: IGrainStockProducerDomain[],
  cropName: string,
) => `
*🌾 ESTOQUE DE GRÃOS POR CLIENTE*
Saldo do estoque de grãos por *cliente* da cultura *${cropName}*
${producersBalance.map((producerBalance) => `
*${producerBalance.client}*
${formatNumber(producerBalance.balance, ' Kg')} | ${formatNumber(producerBalance.balance / 60, ' Sacas')}
`).join('')}${producersBalance.length === 0 ? '\n_*NENHUM ESTOQUE EM SILO*_' : ''}
`.trim();

export const grainStockByStorageMessage = (
  producersBalance: IGrainStockStorageDomain[],
  cropName: string,
) => `
*🌾 ESTOQUE DE GRÃOS POR SILO*
Saldo do estoque de grãos por *silo* da cultura *${cropName}*
${producersBalance.map((producerBalance) => `
*${producerBalance.storage}*
${formatNumber(producerBalance.balance, ' Kg')} | ${formatNumber(producerBalance.balance / 60, ' Sacas')}
`).join('')}${producersBalance.length === 0 ? '\n_*NENHUM ESTOQUE EM SILO*_' : ''}
`.trim();

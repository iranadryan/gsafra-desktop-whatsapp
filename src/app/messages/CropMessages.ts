import { ICropDomain } from '../../types/CropTypes';
import { capitalizeString } from '../../utils/capitalizeString';

export const cropMessage = (crops: ICropDomain[]) => `
Pra finalizar, escolha a cultura desejada?
${crops.map((crop) => `
*${crop.id} - _${capitalizeString(crop.name)}_*
`.trimEnd()).join('')}
*V - _Voltar_*

_Responda com o número referente ao que deseja_
`.trim();

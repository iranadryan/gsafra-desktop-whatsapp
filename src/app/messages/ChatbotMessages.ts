import moment from 'moment';
import 'moment/locale/pt-BR';
import { capitalizeString } from '../../utils/capitalizeString';

export const notFoundMessage = `
Desculpa, não entendi! 😕
Você poder iniciar uma nova conversar com um desses *termos*:

_- Oi_
_- Olá_
_- Inciar_
_- Início_
_- GSafra_
`.trim();

export const endMessage = `
Seu relatório foi processado! 😁
Deseja voltar para o menu inicial?

*1 - _Voltar para o menu inicial_*
*2 - _Voltar uma etapa atrás_*
*3 - _Finalizar conversa_*
`.trim();

export const endedMessage = `
Conversa finalizada!
Até a próxima 👋
`.trim();

export const mainMenuMessage = (modulesPermitted: string[]) => `
Qual módulo deseja acessar?

*1 - _Financeiro${modulesPermitted.includes('FINANCEIRO') ? '' : ' 🔒'}_*
*2 - _Agricultura${modulesPermitted.includes('AGRICULTURA') ? '' : ' 🔒'}_*

_Responda com o número referente ao que deseja_
`.trim();

export const financialReportsMessage = (itemsPermitted: string[]) => `
Você está no módulo *Financeiro* 🏦
Qual relatório você gostaria?

*1 - _Contas a Pagar${itemsPermitted.includes('RELATORIO_CONTAS_PAGAR') ? '' : ' 🔒'}_*
*2 - _Contas a Receber${itemsPermitted.includes('RELATORIO_CONTAS_RECEBER') ? '' : ' 🔒'}_*
*V - _Voltar_*

_Responda com o número referente ao que deseja_
`.trim();

export const agricultureReportsMessage = (itemsPermitted: string[]) => `
Você está no módulo *Agricultura* 🌾
Qual relatório você gostaria?

*1 - _Estoque de Grãos por Cultura${itemsPermitted.includes('RELATORIO_ESTOQUE_GRAOS') ? '' : ' 🔒'}_*
*2 - _Estoque de Grãos por Cliente${itemsPermitted.includes('RELATORIO_ESTOQUE_GRAOS') ? '' : ' 🔒'}_*
*3 - _Estoque de Grãos por Silo${itemsPermitted.includes('RELATORIO_ESTOQUE_GRAOS') ? '' : ' 🔒'}_*
*V - _Voltar_*

_Responda com o número referente ao que deseja_
`.trim();

export const periodMessage = `
Pra finalizar, escolha o período desejado?

*1 - _Do dia atual:_* _${moment().format('DD/MM/YYYY')}_
*2 - _Dos próximos 7 dias:_* _${moment().format('DD/MM/YYYY')} - ${moment()
  .add(6, 'days')
  .format('DD/MM/YYYY')}_
*3 - _Do mês atual:_* _${capitalizeString(moment().format('MMMM'))}_
*V - _Voltar_*

_Responda com o número referente ao que deseja_
`.trim();

export const notPermittedMessage = `
Sinto muito, mas você não tem acesso a esta função 😕
Deseja voltar para o menu inicial?

*1 - _Voltar para o menu inicial_*
*2 - _Voltar uma etapa atrás_*
*3 - _Finalizar conversa_*
`.trim();

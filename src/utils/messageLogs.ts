import chalk from 'chalk';

export function messageSuccessLog(messageName: string, contacts: string[]) {
  console.log(chalk.green(`✓ Mensagem de ${chalk.bold(messageName)} enviada com sucesso para ${contacts.length === 1 ? 'o número:' : 'os números:'} ${chalk.bold(contacts.join(', '))}!`));
}

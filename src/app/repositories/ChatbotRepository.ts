import database from '../../database';

class ChatbotRepository {
  findHasPermission(number: string) {
    return new Promise<boolean>((resolve, reject) => {
      database.query(`
      select * from chatbot_permissao
      where numero_celular = '${number}'
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result.length > 0);
      });
    });
  }

  findModulesPermitted(number: string) {
    return new Promise<string[]>((resolve, reject) => {
      database.query(`
      select distinct(modulo)
      from chatbot_permissao_item
      inner join chatbot_permissao on chatbot_permissao.id = chatbot_permissao_item.id_chatbot_permissao
      where chatbot_permissao.numero_celular = '${number}'

      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result.map((item) => item.MODULO));
      });
    });
  }

  findItemsPermitted(number: string) {
    return new Promise<string[]>((resolve, reject) => {
      database.query(`
      select distinct(item)
      from chatbot_permissao_item
      inner join chatbot_permissao on chatbot_permissao.id = chatbot_permissao_item.id_chatbot_permissao
      where chatbot_permissao.numero_celular = '${number}'

      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result.map((item) => item.ITEM));
      });
    });
  }
}

export default new ChatbotRepository();

import database from '../../database';
import { notificationsType } from '../../types/NotificationTypes';

class NotificationRepository {
  findContactsNotification(notification: notificationsType) {
    return new Promise<string[]>((resolve, reject) => {
      database.query(`
      select usuario.whatsapp_notificacao
      from usuario_notificacao_zap
      inner join usuario on usuario.id = usuario_notificacao_zap.id_usuario
      inner join notificacao_zap on notificacao_zap.id = usuario_notificacao_zap.id_notificacao_zap
      where notificacao_zap.codigo = '${notification}'
      and usuario.status = 1
      and notificacao_zap.situacao = 1
      `, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result.map((contact) => (
          '55' +
          contact.WHATSAPP_NOTIFICACAO.slice(0, 2) +
          contact.WHATSAPP_NOTIFICACAO.slice(3)
        )));
      });
    });
  }
}

export default new NotificationRepository();

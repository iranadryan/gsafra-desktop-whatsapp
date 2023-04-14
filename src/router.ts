import { response, Router } from 'express';
import axios from 'axios';
import {
  deleteInstanceURL,
  generateQrcodeURL,
  initInstanceURL,
  instanceInfoURL,
  logoutInstanceURL,
  sendTextMessageURL
} from './config/whatsappApi';
import { socket } from './lib/socket';

const router = Router();

router.get('/', async (request, response) => {
  try {
    const { data: instanceInfo } = await axios(instanceInfoURL);

    if (instanceInfo.instance_data.phone_connected) {
      return response.redirect('/connected');
    }

    await axios(initInstanceURL);

    return response.render('index');
  } catch {
    await axios(initInstanceURL);

    return response.render('index');
  }
});

router.get('/test-socket', (request, response) => {
  socket.emit('testCommunication', 'test');

  response.sendStatus(200);
});

router.get('/connected', (request, response) => {
  response.render('connected');
});

router.get('/qrcode', async (request, response) => {
  const { data } = await axios(generateQrcodeURL);

  response.json(data);
});

router.get('/disconnect', async (request, response) => {
  await axios({
    method: 'delete',
    url: logoutInstanceURL
  });
  await axios({
    method: 'delete',
    url: deleteInstanceURL
  });

  response.sendStatus(204);
});

router.get('/test-whatsapp', async (request, response) => {
  try {
    await axios({
      method: 'post',
      url: sendTextMessageURL,
      data: {
        id: '559180589159',
        message: 'Mensagem de teste'
      }
    });

    response.json({ message: 'Mensagem enviada com sucesso' });
  } catch {
    response.json({ message: 'Mensagem não enviada' });
  }

});

export default router;

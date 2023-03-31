import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/', async (request, response) => {
  try {
    const { data: instanceInfo } = await axios('http://localhost:3333/instance/info?key=gsafra');

    if (instanceInfo.instance_data.phone_connected) {
      return response.redirect('/connected');
    }

    return response.render('index');
  } catch {
    await axios('http://localhost:3333/instance/init?key=gsafra&token=COYOTE_DEV');

    return response.render('index');
  }
});

router.get('/connected', (request, response) => {
  response.render('connected');
});

router.get('/qrcode', async (request, response) => {
  const { data } = await axios('http://localhost:3333/instance/qrbase64?key=gsafra');

  response.json(data);
});

router.get('/disconnect', async (request, response) => {
  await axios({
    method: 'delete',
    url: 'http://localhost:3333/instance/logout?key=gsafra'
  });

  response.sendStatus(204);
});

router.get('/test-whatsapp', async (request, response) => {
  await axios({
    method: 'post',
    url: 'http://localhost:3333/message/text?key=gsafra',
    data: {
      id: '559180589159',
      message: 'Mensagem de teste'
    }
  });

  response.json({ message: 'Mensagem enviada com sucesso' });
});

export default router;

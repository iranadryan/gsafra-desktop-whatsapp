import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/', async (request, response) => {
  await axios('http://localhost:3333/instance/init?key=gsafra&token=COYOTE_DEV');

  response.render('index');
});

router.get('/qrcode', async (request, response) => {
  const { data } = await axios('http://localhost:3333/instance/qrbase64?key=gsafra');

  response.json(data);
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

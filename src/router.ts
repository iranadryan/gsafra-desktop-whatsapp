import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/', async (request, response) => {
  // await axios('http://localhost:3333/instance/init?key=gsafra&token=COYOTE_DEV');

  response.render('index');
});

router.get('/qrcode', async (request, response) => {
  const { data } = await axios('http://localhost:3333/instance/qrbase64?key=gsafra');

  response.json(data);
});

export default router;

import { Router } from 'express';
import database from './database';

const router = Router();

router.get('/', (request, response) => {
  database.query(`
    select * from ciclo_producao
    where status = 1
    order by nome
  `, (err, safras) => {
    response.json(safras);
  });
});

export default router;

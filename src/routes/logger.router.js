import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  req.logger.debug('debug');
  req.logger.http('http');
  req.logger.info('info');
  req.logger.warning('warning');
  req.logger.error('error');
  req.logger.fatal('fatal');
  res.send('logger test');
});

export default router;
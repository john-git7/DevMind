import express from 'express';
import * as repoController from '../controllers/repoController';
import { validateBody, validateQuery } from '../middleware/validate';
import { 
  indexRepoSchema, 
  repoUrlSchema, 
  skipFileSchema, 
  getFileSchema, 
  statusQuerySchema 
} from '../schemas/repo.schema';

const router = express.Router();

router.get('/indexed', repoController.getIndexedRepos);
router.get('/file', validateQuery(getFileSchema), repoController.getFile);
router.post('/analyze', validateBody(repoUrlSchema), repoController.analyze);
router.post('/pause', validateBody(repoUrlSchema), repoController.pause);
router.post('/skip-file', validateBody(skipFileSchema), repoController.skip);
router.post('/index', validateBody(indexRepoSchema), repoController.index);
router.get('/status', validateQuery(statusQuerySchema), repoController.status);
router.delete('/delete', validateBody(repoUrlSchema), repoController.deleteRepo);
router.get('/prs', repoController.getPRs);

export default router;

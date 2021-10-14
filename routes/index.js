import expres from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';
import UsersController from '../controllers/UsersController';

const router = expres.Router();

router.get('/', (request, response) => {
  response.send('Welcome to Files Manager App!');
});
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// User Controller

router.post('/users', UsersController.postNew);
router.get('/users/me', UsersController.getMe);

// User Authentication

router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

// POST files

router.post('/files', FilesController.postUpload);

// GET files

router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.get('/files/:id/data', FilesController.getFile);

// PUT files

router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);

export default router;

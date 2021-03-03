import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { SurveysController } from './controllers/SurveysController';
import { SendMailController } from './controllers/SendMailController';
import { AnswersController } from './controllers/AnswersController';
import { NpsController } from './controllers/NpsController';

const router = Router();

const userController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answersController = new AnswersController();
const npsController = new NpsController();

router.post('/users', userController.create);

router.post('/surveys', surveysController.create);
router.get('/surveys', surveysController.show);

router.post('/sendMail', sendMailController.execute);

router.get('/answers/:value', answersController.execute);

router.get('/nps/:survey_id', npsController.execute);

export { router };
import { AppError } from './../errors/AppError';
import { resolve } from 'path';
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({email});

    if(!user) {
      throw new AppError('User does not exists')
    }

    const survey = await surveysRepository.findOne({id: survey_id});

    if(!survey) {
      throw new AppError('Survey does not exists!')
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    

    const surveysUserAlreadyExists = await surveysUsersRepository.findOne({
      where: {user_id: user.id, value:null },
      relations: ['user', 'survey']
    })

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      link: process.env.URL_MAIL,
      id: ''
    };

    if(surveysUserAlreadyExists) {
      variables.id = String(surveysUserAlreadyExists.id);
      await SendMailService.execute(email, String(survey.title), variables, npsPath)
      return response.json(surveysUserAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: String(user.id),
      survey_id: survey.id
    })
    
    await surveysUsersRepository.save(surveyUser);
  
    variables.id = String(user.id);
    
    await SendMailService.execute(email, String(survey.title), variables, npsPath);

    return response.json(surveyUser);
  }
}

export { SendMailController }
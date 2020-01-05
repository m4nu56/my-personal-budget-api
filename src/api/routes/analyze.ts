import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import MovementService from '../../services/MovementService';

const route = Router();

export default (app: Router) => {
  app.use('/analyze', route);

  route.get('/', async (request: Request, response: Response, next: NextFunction) => {
    try {
      const movements = await Container.get(MovementService).analyzeMovementByMonthByCategory();
      return response.status(200).send(movements);
    } catch (e) {
      next(e);
    }
  });

  route.get('/summary', async (request: Request, response: Response, next: NextFunction) => {
    try {
      const movements = await Container.get(MovementService).analyzeMovement();
      return response.status(200).send(movements);
    } catch (e) {
      next(e);
    }
  });
};

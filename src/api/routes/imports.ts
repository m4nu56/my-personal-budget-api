import { NextFunction, Request, Response, Router } from 'express';
import MovementService from '../../services/MovementService';
import { Container } from 'typedi';
import ImportService from '../../services/ImportService';

const route = Router();

export default (app: Router) => {
  app.use('/imports', route);

  route.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movements = await Container.get(ImportService).fromCsv(req.body);
      return res.status(201).send(movements);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });
};
